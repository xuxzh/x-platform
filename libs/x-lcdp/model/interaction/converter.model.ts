import { InjectionToken } from '@angular/core';
import { RhSafeAny, WithNil } from '@x/base/model';
import { RhOperation } from './operation.model';
import { IComponentFieldSetting } from '../designer.model';

/** 操作类型 */
export type RhConverterKey = string;

/** 操作项分组 */
export enum eRhConverterGroups {
  BOOLEAN = 'boolean',
  DATE = 'date',
  JSON = 'json',
  STRING = 'string',
  ARRAY = 'array',
  OBJECT = 'object',
  ANY = 'any',
  NUMBER = 'number',
}

/** 转换器 */
export class RhConverter {
  public debugger?: boolean;
}

/** 转换器数据集 */
export type RhConvertersDataset = Record<RhConverterKey, new () => RhConverter>;
/** 转换器定义集的注入令牌 */
export const CONVERTERS_DATASET_TOKEN = new InjectionToken<RhConvertersDataset>(
  'CONVERTERS_DATASET'
);

/** 处理器（转换器的实际执行者）定义 */
export interface RhConverterHandler<T extends RhConverter> {
  /** 是否会变更传入的target */
  readonly willChangeTarget?: boolean;
  /** target的描述信息 */
  readonly targetDescription?: string;
  /** 是否异步 */
  readonly showAwait?: boolean;
  /** 是否允许返回undefined */
  readonly allowReturnUndefined?: boolean;
  /** 具体的执行函数 */
  do(config: T, $: RhSafeAny): RhSafeAny;
}
/** 转换器定义集 */
export type RhConverterHandlersDataset = Record<
  RhConverterKey,
  RhConverterHandler<RhOperation>
>;
/** 转换器定义集的注入令牌 */
export const CONVERTER_HANDLERS_DATASET_TOKEN =
  new InjectionToken<RhConverterHandlersDataset>('CONVERTER_HANDLERS_DATASET');

/** 转换器配置表单的表单项定义 */
export interface RhConverterConfigSchemaField extends IComponentFieldSetting {
  /** 测试字段 */
  __test?: RhSafeAny;
}
/** 转换器配置表单的表单定义 */
export interface RhConverterConfigSchema {
  name: string;
  groupKey?: string;
  groupName?: string;
  fields: RhConverterConfigSchemaField[];
}
/** 所有转换器的配置表单的数据集 */
export type RhConverterConfigSchemasDataset = Record<
  RhConverterKey,
  RhConverterConfigSchema
>;
/** 所有转换器的配置表单的数据集的注入令牌 */
export const CONVERTER_CONFIG_SCHEMAS_DATASET_TOKEN =
  new InjectionToken<RhConverterConfigSchemasDataset>(
    'CONVERTER_CONFIG_SCHEMAS_DATASET'
  );

/** 一组转换器 */
export class RhConvertHandlersGroup {
  /** 唯一id */
  public id?: string;
  /** key值 */
  key?: WithNil<string>;
  /** 名称 */
  name?: WithNil<string>;
  /** 是否启用 */
  enabled = true;
  /** 事件处理器队列 */
  handlers: RhConvertHandler[] = [];
}

/** 单个转换器 */
export class RhConvertHandler {
  /** 唯一id */
  public id?: string;
  /** 名称 */
  public name: WithNil<string> = null;
  /** 是否启用。关闭后，将不执行此事件处理器 */
  public disabled = false;
  /** 要执行的操作 */
  public do!: RhConverterKey;
  /** 操作的具体配置 */
  public detail: RhSafeAny = {};
  /** 转换器。用于在执行操作前，对传入数据进行转换 */
  //public converter: WithNil<string> = null;
  /** 是否不等待此操作执行完成 */
  public noWait = false;
  /** 是否已展开。在设计器中用到 */
  public expanded?: boolean;
}
