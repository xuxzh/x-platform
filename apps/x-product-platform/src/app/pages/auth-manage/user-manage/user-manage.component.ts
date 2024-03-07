import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserDto } from '@model';
import { SharedModule } from '@shared';
import { UserWhereInput } from './user-where';
import { XIsEmpty, BaseOrder, BasePagination, CoreModule } from '@core';
import { UserManageService } from './user-manage.service';
import { delay, finalize, tap } from 'rxjs';

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

  userDataset: UserDto[] = [];

  index = 1;
  total = 0;
  size = 10;
  tableLoading = false;

  fb = inject(FormBuilder);

  userSer = inject(UserManageService);

  ngOnInit(): void {
    this.userQueryForm = this.fb.group({
      UserCode: [null],
      UserName: [null],
    });
  }

  action() {
    this.tableLoading = true;
    this.userSer
      .users(this.setParams(this.index, this.size))
      .pipe(
        delay(300),
        tap((data) => this.resultConvert(data)),
        finalize(() => {
          this.tableLoading = false;
        })
      )
      .subscribe();
  }

  private setParams(index: number, size: number) {
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
