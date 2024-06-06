import { Type } from '@angular/core';
import {
  IDisplay,
  IXSelectable as IXSelectable,
  RhSafeAny,
  WithNil,
} from '@x/base/model';
import type { Observable } from 'rxjs';

/** 组件类型:通用组件、 基础组件、动态组件、业务组件、模板组件、容器 */
export type RhComponentResourceType =
  | 'general'
  | 'input'
  | 'display'
  | 'container'
  | 'dynamic'
  | 'business'
  | 'page'
  | 'sub-page'
  | 'void'; // 表示为容器节点的直接子节点

export enum DesignerComponentType {
  /** 按钮 */
  Btn = 'btn',
  /** 原生div */
  Div = 'div',
  Void = 'void',
  SubPage = 'sub-page',
  /** //FIXME: */
  Home = 'home',
}

/** schema触发来源 */
export type XJsonSchemaTriggerOrigin =
  | 'canvas'
  | 'config'
  | 'code'
  | 'json'
  | null;

/** json schema的操作类型：选择|删除|复制|节点编辑|节点拖拽|添加子节点|初始化JSON Schema
 * @description 每次操作会在`JsonSchemaService`存储当前的操作类型，消费者可以根据当前的操作类型判断是否需要更新自身的组件
 */
export type XJsonSchemaOperationType =
  | 'select'
  | 'delete'
  | 'copy'
  | 'node-edit' // 节点编辑状态，右侧节点编辑组件会订阅此类变更，且当其在进行操作时，也是这个状态
  | 'drag'
  | 'add-child'
  | 'init' // 初始化，手动刷新方法也会触发初始化
  | 'refresh'
  | 'node' // 节点类型，一般用于模态框等子页面的类型标注 ;
  | 'do' // redo undo 撤销和反撤销操作
  | null;

/** //TODO: 类型优化 组件字段类型 */
export type XDesignerFieldType =
  | 'boolean'
  | 'string'
  | 'date'
  | 'number'
  /** 下拉选择 */
  | 'select'
  /** 下拉多选 */
  | 'multi-select'
  | 'custom-select'
  /** 设置成此项，需要在组件内部自行将string处理成function */
  | 'javascript'
  | 'json'
  | 'css'
  | 'color'
  | 'button'
  | 'popConfirm'
  | 'boolean'
  | 'template'
  | 'any'
  /** 选择实例 */
  | 'selectInstance'
  /** 选择图标 */
  | 'selectIcon'
  /** 选择接口 */
  | 'selectInterface';

/** 设计模板类型 */
export type XTemplateSchemaType = {
  /** 页面children json */
  jsonSchema: IComponentSchema[];
  /** 页面数据集 */
  jsonProp: Record<string, RhSafeAny>;
  /** 子页面数据 */
  jsonSubPages: IComponentSchema[];
};

/** 组件池数据模型 */
export interface IComponentPoolData extends IDisplay {
  children: IComponentResource[];
  active: boolean;
  hide?: boolean;
  /** 类型 */
  type?: RhComponentResourceType;
  icon?: string;
}

/** 组件图标映射关系 */
export const XComponentIconMapping: Record<DesignerComponentType, string> = {
  [DesignerComponentType.Btn]: 'bold',
  [DesignerComponentType.Div]: 'border',
  // FIXME:
  [DesignerComponentType.Void]: 'setting',
  [DesignerComponentType.SubPage]: 'setting',
  [DesignerComponentType.Home]: 'home',
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
  /** 是否包含子容器
   * @description 包含子容器的`container`组件，会在拖动时自动初始化子容器JSON数据
   */
  hasChildContainer?: boolean;
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

/** 组件(节点)样式配置 */
export interface IComponentStyle {
  default: WithNil<string[]>;
  hover: WithNil<string[]>;
  active: WithNil<string[]>;
}

/**
 * JSON节点
 */
export type ISchemaNode = IPageSchema | IComponentSchema;

/** json schema的操作类型：选择|删除|复制|节点编辑|节点拖拽|添加子节点|初始化JSON Schema
 * @description 每次操作会在`JsonSchemaService`存储当前的操作类型，消费者可以根据当前的操作类型判断是否需要更新自身的组件
 */
export type XSchemaOperationType =
  | 'select'
  | 'delete'
  | 'copy'
  | 'node-edit' // 节点编辑状态，右侧节点编辑组件会订阅此类变更，且当其在进行操作时，也是这个状态
  | 'drag'
  | 'add-child'
  | 'init' // 初始化，手动刷新方法也会触发初始化
  | 'refresh'
  | 'node' // 节点类型，一般用于模态框等子页面的类型标注 ;
  | 'do' // redo undo 撤销和反撤销操作
  | null;

/** 页面JSON */
export type IPageSchema = IComponentSchema & {
  /** 子页面配置 */
  subPages: IComponentSchema[];
};

/** 设计界面JSON Schema节点模型 */
export interface IComponentSchema extends IXSelectable {
  /** 唯一标识，一般自动生成guid */
  key: string;
  /** 组件类型，`basic-div`|`basic-button`等 */
  compType: DesignerComponentType;
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
  /** //TODO:组件类名规范，考虑使用`tailwindcss`,组件类 */
  'x-component-class'?: WithNil<IComponentStyle>;
  /** 子节点配置 */
  children: IComponentSchema[];

  /** 组件配置，用来存什么？ */
  config?: Record<string, RhSafeAny>;
}

export interface IComponentFieldSetting {
  /** 属性名称 */
  name: string;
  /** 展示名称 */
  displayName: string;
  /** 类型 */
  type: XDesignerFieldType;
  /** 默认取值 */
  defaultValue?: WithNil<RhSafeAny>;
  require?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 提示信息 */
  tooltip?: string;
  options?: IDisplay[];
  /** 选项可添加 */
  addable?: boolean;
  /** 是否只读 */
  disabled?: boolean;
  /** 选项的生成函数 */
  optionsCreator?(page: IPageSchema, host?: RhSafeAny): Observable<IDisplay[]>;
  /** 分组key值 */
  groupKey?: string;
  /** 分组名称 */
  groupName?: string;
  /** 附加数据 */
  extra?: RhSafeAny;
  /** 高级配置 */
  config?: RhSafeAny;
  /** 启用自定义运算模式 */
  enableDynamicValue?: boolean;
  /** 启用自定义模板 */
  enableCustomTemplate?: boolean;
}
