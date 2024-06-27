import { NgModule } from '@angular/core';
import { XBasicButtonComponent } from './general';
import { XBasicDivComponent } from './container';

const poolDatas = [XBasicButtonComponent, XBasicDivComponent];

@NgModule({
  imports: [...poolDatas],
  exports: [...poolDatas],
})
export class XRenderComponentModule {}
