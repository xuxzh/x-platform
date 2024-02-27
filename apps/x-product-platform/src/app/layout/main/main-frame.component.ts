import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DisplayDto } from '@model';

@Component({
  selector: 'xp-main-frame',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-frame.component.html',
  styleUrl: './main-frame.component.less',
})
export class MainFrameComponent {
  menuDatas: DisplayDto[] = [
    {
      name: 'UserManage',
      displayName: '用户管理',
    },
  ];

  router = inject(Router);

  navigate(menu: string) {
    this.router.navigate([`/main/${menu}`]);
  }
}
