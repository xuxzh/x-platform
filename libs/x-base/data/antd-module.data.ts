import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgModule } from '@angular/core';

/** 常用antd模块 */
const antdModule = [
  NzButtonModule,
  NzIconModule,
  NzTableModule,
  NzCardModule,
  NzCollapseModule,
  NzInputModule,
];

@NgModule({
  imports: [...antdModule],
  exports: [...antdModule],
})
export class XAntdModule {}

//  { XAntdModule };
