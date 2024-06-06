import { InjectionToken } from '@angular/core';
import { RhConverter } from './converter.model';
import { RhSafeAny, WithNil } from '@x/base/model';

/** 操作类型 */
export type RhOperationKey = string;

/** 操作项 */
export class RhOperation extends RhConverter {}

/** 操作项分组 */
export enum eRhOperationGroups {
  INSTANCE = 'instance',
  DEBUG = 'debug',
  MODEL = 'model',
  DATASOURCE = 'datasource',
  FEEDBACK = 'feedback',
  VARIABLE = 'variable',
  ADVANCED = 'advanced',
  SIGNALR = 'signalr',
  MODAL = 'modal',
  DATASET = 'dataset',
  RHV = 'rhv',
}

/** 实例操作 */
export class RhInstanceOperation extends RhOperation {
  constructor(
    /** 实例key值 */
    public instanceKey: string
  ) {
    super();
  }
}

/** 操作项数据集 */
export type RhOperationsDataset = Record<RhOperationKey, new () => RhOperation>;
/** 处理器定义集的注入令牌 */
export const OPERATIONS_DATASET_TOKEN = new InjectionToken<RhOperationsDataset>(
  'OPERATIONS_DATASET'
);

/** 副本组件信息集 */
export class RhDuplicateCompDto {
  constructor(
    /** 副本实例key值 */
    public DuplicateKey: WithNil<string[]>,
    /** 副本实例目标位数 */
    public DuplicateIndex: WithNil<RhSafeAny>,
    /** 是否副本组件 */
    public IsDuplicateComp: boolean
  ) {}
  static create() {
    return new RhDuplicateCompDto(null, null, false);
  }
}
