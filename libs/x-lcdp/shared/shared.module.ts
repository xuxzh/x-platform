import { NgModule } from '@angular/core';
import { NestedDroplistPoolComponent } from './widgets/index';
import {
  ANTD_COMPONENT_POOL_DATASET,
  RH_COMPONENT_SOURCE_CONFIG,
} from '@x/lcdp/data';
const widgets = [NestedDroplistPoolComponent];

@NgModule({
  imports: [...widgets],
  exports: [...widgets],
  providers: [
    {
      provide: RH_COMPONENT_SOURCE_CONFIG,
      useValue: ANTD_COMPONENT_POOL_DATASET,
    },
  ],
})
export class XLcdpSharedModule {}
