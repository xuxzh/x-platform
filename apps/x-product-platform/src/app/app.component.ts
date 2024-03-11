import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [NzMessageModule, NzModalModule, RouterModule],
  selector: 'xp-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'x-product-platform';
}
