import { InjectionToken } from '@angular/core';
import {
  DesignerComponentType,
  IComponentResource,
  IComponentResourceGroup,
  XComponentIconMapping as Icons,
} from '@x/lcdp/model';
// import { NzButtonComponent } from 'ng-zorro-antd/button';
import { XBasicButtonComponent, XBasicDivComponent } from '@x/base/shared';

/** 组件池数据 */
export const RH_COMPONENT_SOURCE_CONFIG = new InjectionToken<
  IComponentResource[]
>('RH_COMPONENT_SOURCE_CONFIG');

/**
 * 组件池数据源:(ng-zorro-antd组件库)
 */
export const ANTD_COMPONENT_POOL_DATASET: IComponentResourceGroup[] = [
  {
    name: 'General Component',
    displayName: '通用组件',
    type: 'general',
    expand: false,
    children: [
      {
        name: DesignerComponentType.Btn,
        displayName: '按钮',
        description: '按钮',
        type: 'general',
        icon: Icons['btn'],
        component: XBasicButtonComponent,
      },
      {
        name: DesignerComponentType.Div,
        displayName: 'DIV',
        description: '原生DIV',
        type: 'general',
        icon: Icons['div'],
        component: XBasicDivComponent,
      },
    ],
  },
  {
    name: 'Container Component',
    displayName: '容器组件',
    type: 'container',
    expand: false,
    children: [],
  },
  {
    name: 'Input Component',
    displayName: '输入组件',
    type: 'input',
    expand: false,
    children: [],
  },
  {
    name: 'Display Component',
    displayName: '展示组件',
    type: 'display',
    expand: false,
    children: [],
  },
  {
    name: 'Dynamic Component',
    displayName: '动态组件',
    type: 'dynamic',
    expand: false,
    children: [],
  },
];
