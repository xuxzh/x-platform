import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XAntdModule } from '@x/base/data';

@NgModule({
  imports: [XAntdModule],
  declarations: [],
  providers: [],
  exports: [CommonModule, XAntdModule],
})
export class XSharedModule {}
