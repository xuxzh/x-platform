import { NgModule } from '@angular/core';
import { BasicButtonDirective } from './general';

@NgModule({
  imports: [BasicButtonDirective],
  exports: [BasicButtonDirective],
})
export class XRenderComponentModule {}
