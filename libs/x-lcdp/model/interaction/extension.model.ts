import { RhSafeAny } from '@x/base/model';
import {
  DesignerComponentType,
  IComponentSchema,
  IPageSchema,
  RhComponentResourceType,
  RhEventsListenersDataset,
} from '../designer.model';
import { RhEventHandler, RhEventListener } from './event.model';
import { RhModelFieldType } from './model-field.model';
import { RhPageProps } from './page.model';
import { RhVariable } from './variable.model';

export class RhExtensionPack implements IPageSchema {
  /** 组件属性 */
  public 'x-component-props': RhPageProps;
  /** 组件事件 */
  public 'x-component-events': RhEventsListenersDataset;
  /** json schema对应的一维数据 */
  public 'x-component-styles': Record<string, RhSafeAny>;

  public key = 'PAGE_KEY';
  public name = 'home';
  public type: RhComponentResourceType = 'page';
  public compType = DesignerComponentType.Home;
  public displayName = '主设计页面';
  public parent = null;
  /** 关联的宿主页面 */
  public host?: IPageSchema;

  constructor(
    /** 子节点配置 */
    public children: IComponentSchema[] = [],
    props: RhPageProps = new RhPageProps(),
    events: RhEventsListenersDataset = {},
    public subPages: IComponentSchema[] = []
  ) {
    this['x-component-props'] = props;
    this['x-component-events'] = events;
  }

  static createFrom(origin?: IPageSchema | IComponentSchema) {
    if (origin?.type == 'page') {
      const extension = new RhExtensionPack(origin.children);
      Object.assign(extension, origin);
      return extension;
    } else {
      return new RhExtensionPack(origin ? [origin] : []);
    }
  }
}

export class RhExtensionPackOutputs {
  constructor(
    public data: RhExtensionPackDataBinding = new RhExtensionPackDataBinding(
      ''
    ),
    public attributes: RhExtensionPackAttribute[] = [],
    public methods: RhExtensionPackMethod[] = [],
    public events: RhExtensionPackEvent[] = []
  ) {}
}

export class RhExtensionPackDataBinding {
  constructor(public variableKey: string) {}
}

export class RhExtensionPackMethod {
  constructor(
    public key: string,
    public name: string,
    public handlers: RhEventHandler[] = [],
    public params: RhVariable[] = [],
    public description?: string
  ) {}
}

export class RhExtensionPackAttribute {
  constructor(
    public key: string,
    public name: string,
    public isArray = false,
    public type: RhModelFieldType = 'any',
    public valueListener: RhEventListener = new RhEventListener(),
    public defaultValue: RhSafeAny = null
  ) {}
}

export class RhExtensionPackEvent {
  constructor(
    public key: string,
    public name: string,
    public instanceKey: string,
    public triggerOrigin: string,
    public position: number,
    /** target值说明。与组件注册表中的事件注册信息中的字段一致 */
    public targetDescription?: string
  ) {}
}

/** 扩展包内部事件订阅频道 */
export const EXTENSION_EVENT_CHANNEL = 'extension.event';
/** 扩展包最新版本的路径标识 */
export const EXTENSION_LATEST_VERSION = 'LATEST';
/** 扩展包当前版本的路径标识 */
export const EXTENSION_CURRENT_VERSION = 'CURRENT';
/** 扩展包服务端草稿版本的路径标识 */
export const EXTENSION_SERVER_DRAFT_VERSION = 'DRAFT';
/** 扩展包已导入清单的存储路径 */
export const EXTENSION_IMPORTED_LIST_STORAGE_PATH =
  'EXTENSION_IMPORTED_LIST_STORAGE_PATH';

/** 子模块页面的key前缀 */
export const SUB_MODULE_KEY_PREFIX = 'SUB_MODULE@';
