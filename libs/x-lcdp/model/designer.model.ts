import { Type } from '@angular/core';
import { IDisplay, ISelectableDto, RhSafeAny, WithNil } from '@x/base/model';

/** 组件类型:通用组件、 基础组件、动态组件、业务组件、模板组件、容器 */
export type RhComponentResourceType =
  | 'general'
  | 'input'
  | 'display'
  | 'container'
  | 'dynamic'
  | 'business'
  | 'void'; // 表示为容器节点的直接子节点

export enum DesignerComponentType {
  /** 按钮 */
  Btn = 'btn',
  /** 原生div */
  Div = 'div',
}

/** 组件图标映射关系 */
export const RhComponentIconMapping: Record<DesignerComponentType, string> = {
  [DesignerComponentType.Btn]: 'bold',
  [DesignerComponentType.Div]: 'border',
};

/** 事件及监听器列表 */
export type RhEventsListenersDataset = Record<string, IEventListener>;

export class IEventListener {
  /** 唯一id */
  public id?: string;
  /** key值 */
  key?: WithNil<string>;
  /** 名称 */
  name?: WithNil<string>;
  /** 是否启用 */
  enabled = true;
  /** //TODO: 事件处理器队列 */
  handlers: RhSafeAny[] = [];
  /** 是否已展开。在设计器中用到 */
  public expanded?: boolean;
}

/** 组件池组件资源模型 */
export interface IComponentResource extends IDisplay {
  type: RhComponentResourceType;
  component: Type<RhSafeAny> | null;
  /** 组件配置，一般为组件的`@Input`和`@Output` */
  config?: WithNil<Record<string, RhSafeAny>>;
  children?: IComponentResource[];
  icon?: string;
}

export type IComponentResourceGroup = IDisplay & {
  children: IComponentResource[];
};

export interface IDataLinkConfig {
  enabled: boolean;
  /** 临时值。在组件未初始化时，修改的值会临时存在这里，待节点实例化后，再应用上去，并置空此临时值 */
  value?: RhSafeAny;
  /** 使用dataset的指定数据字段 */
  field: WithNil<string>;
  /** 数据关联模式 */
  mode: 'use' | 'bind';
  /** 启用转换器 */
  enablePipe: boolean;
  /** 数据接收转换管道 */
  pipe?: string;
  /** 是否在所有模式下启用数据接收转换管道 */
  enablePipeInAllMode: boolean;
  /** 启用默认值 */
  enableDefaultValue: boolean;
  /** 默认值。实现一个()=>any方法，用于初始化时生成初始数据。 */
  defaultValue?: string;
}

export interface IComponentStyleDto {
  default: WithNil<string[]>;
  hover: WithNil<string[]>;
  active: WithNil<string[]>;
}

/** 用于存储的组件JSON schema模型 */
export interface IComponentSchemaDto extends ISelectableDto {
  /** 唯一标识，一般自动生成guid */
  key: string;
  /** 组件类型，`basic-div`|`basic-button`等 */
  compType: string;
  name: string;
  /** 组件中文名称 */
  displayName: string;
  functionAuth?: string;
  /** 组件中文描述 */
  description?: string;
  /** 组件类型 */
  type: RhComponentResourceType;
  /** 是否嵌套有子容器 */
  hasChildContainer?: boolean;
  /** 父节点Key */
  parent: string | null;
  /** 组件类对应的标识 */
  'x-component'?: string;
  /** 组件数据 */
  'x-component-data'?: WithNil<IDataLinkConfig>;
  /** 组件属性 */
  'x-component-props'?: WithNil<Record<string, RhSafeAny>>;
  /** 组件事件 */
  'x-component-events'?: WithNil<RhEventsListenersDataset>;
  /** 包装器样式
   * @description 组件池中的非容器组件`type !=='container'`，一般都会包装一层div，针对这层div可以设置样式
   */
  'x-wrapper-styles'?: WithNil<Record<string, RhSafeAny>>;
  /** 组件样式 */
  'x-component-styles'?: WithNil<Record<string, RhSafeAny>>;
  /** 组件类 */
  'x-component-class'?: WithNil<IComponentStyleDto>;
  /** 子节点配置 */
  children: IComponentSchemaDto[];
  /** 子页面配置 */
  subPages?: IComponentSchemaDto[];
  /** 组件配置，用来存什么？ */
  config?: Record<string, RhSafeAny>;
}
