import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RhSafeAny, UserDto } from '@model';
import { SharedModule } from '@shared';
import { UserWhereInput } from './user-where';
import { XIsEmpty, BaseOrder, BasePagination, CoreModule } from '@core';
import { UserManageService } from './user-manage.service';
import { delay, finalize, tap } from 'rxjs';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_INDEX } from '@data';

@Component({
  selector: 'xp-user-manage',
  standalone: true,
  imports: [CommonModule, CoreModule, SharedModule],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.less',
  providers: [UserManageService],
})
export class UserManageComponent implements OnInit {
  userQueryForm!: FormGroup;
  userForm!: FormGroup;
  userDto = {} as UserDto;
  userDataset: UserDto[] = [];

  total = 0;

  index = DEFAULT_PAGE_INDEX;
  size = DEFAULT_PAGE_SIZE;
  tableLoading = false;

  isShowModal = false;
  title = '新建用户';
  mode: 'edit' | 'add' = 'add';
  saveLoading = false;

  fb = inject(FormBuilder);
  userSer = inject(UserManageService);

  ngOnInit(): void {
    this.userQueryForm = this.fb.group({
      UserCode: [null],
      UserName: [null],
    });
    this.action('search');

    this.userForm = this.fb.group({
      UserCode: [this.userDto.UserCode, [Validators.required]],
      UserName: [this.userDto.UserName, [Validators.required]],
      Remark: [this.userDto.Remark],
    });
  }

  action(type: 'search' | 'edit' | 'delete' | 'reset') {
    switch (type) {
      case 'search': {
        this.tableLoading = true;
        const userQueryDto = this.userQueryForm.value;
        this.userSer
          .getUsers(this.setParams(this.index, this.size, userQueryDto))
          .pipe(
            delay(300),
            tap((data) => this.resultConvert(data)),
            finalize(() => {
              this.tableLoading = false;
            })
          )
          .subscribe();
        break;
      }
      case 'reset': {
        this.userQueryForm.reset();
        this.action('search');
        break;
      }
      case 'edit': {
        if (this.userForm.invalid) {
          return;
        }
        this.userDto = { ...this.userDto, ...(this.userForm.value || {}) };
        this.saveLoading = true;
        if (this.mode === 'add') {
          this.userSer.createUser(this.userDto).subscribe((result) => {
            console.log(result);
          });
        }
        if (this.mode === 'edit') {
          delete (this.userDto as RhSafeAny)['__typename'];
          this.userSer.updateUser(this.userDto).subscribe((result) => {
            console.log(result);
          });
        }
        break;
      }
      case 'delete': {
        break;
      }
    }
  }

  openModal(data?: UserDto) {
    this.isShowModal = true;
    this.mode = data ? 'edit' : 'add';
    this.title = this.mode === 'add' ? '新建用户' : '编辑用户';
    this.userDto = data as UserDto;
    this.userForm.reset(data);
  }

  closeModal() {
    this.isShowModal = false;
  }

  private setParams(index: number, size: number, user: UserDto) {
    const orderBy: BaseOrder[] = [];
    const where: UserWhereInput = {};
    const { UserCode, UserName } = this.userQueryForm.value;

    this.index = index;
    if (!XIsEmpty(UserCode)) {
      where.UserCode = { contains: UserCode };
    }
    if (!XIsEmpty(UserName)) {
      where.UserName = { contains: UserName };
    }

    return {
      skip: (index - 1) * size,
      take: size,
      orderBy,
      where,
    };
  }

  private resultConvert(body: BasePagination<UserDto>) {
    const { data, count } = body;
    this.total = count || 0;
    this.userDataset = data;
  }
}
