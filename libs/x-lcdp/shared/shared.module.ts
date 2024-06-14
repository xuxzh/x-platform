import { NgModule } from '@angular/core';
import { XDroplistPoolComponent } from './widgets/index';
import {
  ANTD_COMPONENT_POOL_DATASET,
  X_COMPONENT_POOL,
} from './infrastructure';
import { XLcdpSharedService } from './services';
import { XRenderComponentModule } from './components';
const widgets = [XDroplistPoolComponent];

@NgModule({
  imports: [...widgets],
  exports: [...widgets, XRenderComponentModule],
  providers: [
    {
      provide: X_COMPONENT_POOL,
      useValue: ANTD_COMPONENT_POOL_DATASET,
    },
    XLcdpSharedService,
  ],
})
export class XLcdpSharedModule {}
