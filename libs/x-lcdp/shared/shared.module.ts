import { NgModule } from '@angular/core';
import { NestedDroplistPoolComponent } from './widgets/index';
const widgets = [NestedDroplistPoolComponent];

@NgModule({
  imports: [...widgets],
  exports: [...widgets],
})
export class XLcdpSharedModule {}
