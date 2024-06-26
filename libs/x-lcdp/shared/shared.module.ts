import { NgModule } from '@angular/core';
import { XDroplistPoolComponent } from './widgets/index';
import {
  ANTD_COMPONENT_POOL_DATASET,
  RH_COMPONENT_SOURCE_CONFIG,
} from '@x/lcdp/data';
import { XLcdpSharedService } from './services';
import { XRenderComponentModule } from './components';
const widgets = [XDroplistPoolComponent];

@NgModule({
  imports: [...widgets],
  exports: [...widgets, XRenderComponentModule],
  providers: [
    {
      provide: RH_COMPONENT_SOURCE_CONFIG,
      useValue: ANTD_COMPONENT_POOL_DATASET,
    },
    XLcdpSharedService,
  ],
})
export class XLcdpSharedModule {}
