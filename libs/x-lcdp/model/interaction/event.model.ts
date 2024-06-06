import { RhSafeAny, WithNil } from '@x/base/model';
import { RhConvertHandler, RhConvertHandlersGroup } from './converter.model';
import { RhDuplicateCompDto } from './operation.model';

// /** 事件及监听器列表 */
// export type RhEventsListenersDataset = Record<string, RhEventListener>;

/** 所有组件通用内置事件 */
export const RH_BUILTIN_INSTANCE_EVENTS: Record<
  string,
  RhComponentEventDefinition
> = {
  onInit: {
    name: '实例初始化完成时',
    targetDescription: '组件实例',
  },
  onDestroy: {
    name: '实例被销毁时',
    targetDescription: '组件实例',
  },
};

/** 事件对象 */
export class RhEvent {
  constructor(
    /** 事件类型。比如onInit,onClick */
    public type: string,
    /** 数据体。由触发源初始化事件时动态确定 */
    public detail: RhSafeAny,
    /** 原始事件。比如onClick时的$event */
    public nativeEvent: RhSafeAny /** 临时数据 */,
    /** 副本组件信息 */
    public DuplicateInfo?: RhDuplicateCompDto //data?: any
  ) {}
}

/** 事件监听对象 */
export class RhEventListener {
  /** 唯一id */
  public id?: string;
  /** key值 */
  key?: WithNil<string>;
  /** 名称 */
  name?: WithNil<string>;
  /** 是否启用 */
  enabled = true;
  /** 事件处理器队列 */
  handlers: RhEventHandler[] = [];
  /** 是否已展开。在设计器中用到 */
  public expanded?: boolean;
}

/** 事件处理对象 */
export class RhEventHandler extends RhConvertHandler {
  /** 是否保存操作执行结果 */
  //public saveResult: boolean = false;
  /** 执行结果存储到dataset的指定字段 */
  //public saveTo: WithNil<string> = null;
  /** 存储前对数据进行转换 */
  //public pipeBeforeSave: WithNil<string> = null;

  public converters?: RhConvertHandlersGroup;

  static create(props: Partial<RhEventHandler>) {
    const dto = new RhEventHandler();
    return Object.assign(dto, props || {});
  }
}

/** 单个事件的定义 */
export interface RhComponentEventDefinition {
  /** 事件名称 */
  name: string;
  /** 事件抛出的target值的描述 */
  targetDescription?: string;
}
/** 单个组件的事件列表 */
export type RhComponentEventsList = Record<
  string,
  RhComponentEventDefinition | string
>;
