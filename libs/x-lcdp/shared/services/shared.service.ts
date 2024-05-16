import { Inject, Injectable, Optional } from '@angular/core';
import { WithNil } from '@x/base/model';
import { RH_COMPONENT_SOURCE_CONFIG } from '@x/lcdp/data';
import {
  IComponentResource,
  IComponentSchema,
  IComponentPoolData,
  XComponentIconMapping,
} from '@x/lcdp/model';

@Injectable()
export class XSharedService {
  constructor(
    @Optional()
    @Inject(RH_COMPONENT_SOURCE_CONFIG)
    private compSourceDataset: IComponentPoolData[]
  ) {
    //
  }
  /** 根据组件名称在找到组件池在的对应组件对象 */
  getTargetComponent(data: IComponentSchema): WithNil<IComponentResource> {
    let targetComp: WithNil<IComponentResource> = null;
    try {
      // 空的包装层
      if (data.type === 'void') {
        return {
          name: 'void',
          displayName: '包装层',
          type: 'void',
          icon: XComponentIconMapping.void,
          component: null,
          templateRef: null,
          componentSetting: null,
        };
      } else {
        this.compSourceDataset.forEach((ele) => {
          if (!ele.children) {
            return;
          }
          const temp = ele.children.find((ele) => ele.name === data.compType);
          if (temp) {
            targetComp = temp;
            throw new Error();
          }
        });
      }
    } catch (error) {
      return targetComp;
    }
    return targetComp;
  }
}
