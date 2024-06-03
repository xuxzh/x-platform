import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XAntdModule } from '@x/base/data';
import { XBasicButtonComponent, XBasicDivComponent } from './widgets';

const comps = [XBasicButtonComponent, XBasicDivComponent];

@NgModule({
  imports: [XAntdModule, ...comps],
  providers: [],
  exports: [CommonModule, XAntdModule, ...comps],
})
export class XSharedModule {}
