import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { IMenuDto } from '@model';

@Component({
  selector: 'xp-main-frame',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-frame.component.html',
  styleUrl: './main-frame.component.less',
})
export class MainFrameComponent {
  menuDatas: IMenuDto[] = [
    {
      MenuCode: 'AuthorityManage',
      MenuName: '授权管理',
      Children: [
        {
          MenuCode: 'UserManage',
          MenuName: '用户管理',
        },
        {
          MenuCode: 'MenuManage',
          MenuName: '菜单管理',
        },
        {
          MenuCode: 'RoleManage',
          MenuName: '角色管理',
        },
      ],
    },
  ];

  router = inject(Router);

  navigate(menu: IMenuDto) {
    this.router.navigate([`/main/${menu.MenuCode}`]);
  }
}
