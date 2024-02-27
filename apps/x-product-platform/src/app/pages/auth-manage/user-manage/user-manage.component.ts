import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserQueryDto } from '@model';
import { SharedModule } from '@shared';

@Component({
  selector: 'xp-user-manage',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.less',
})
export class UserManageComponent {
  userQueryForm: FormGroup;

  userDataset = [];

  fb = inject(FormBuilder);

  constructor() {
    this.userQueryForm = this.fb.group({
      UserCode: [null],
      UserName: [null],
    });
  }

  searchUser(user: UserQueryDto) {
    console.log(user);
  }
}
