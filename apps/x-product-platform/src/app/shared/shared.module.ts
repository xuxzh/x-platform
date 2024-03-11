import { NgModule } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';

const modules = [
  CommonModule,
  NzIconModule,
  ReactiveFormsModule,
  NzFormModule,
  NzButtonModule,
  NzInputModule,
  NzTableModule,
  NzDividerModule,
  NzDropDownModule,
  NzCardModule,
  NzModalModule,
  NzMessageModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class SharedModule {}
