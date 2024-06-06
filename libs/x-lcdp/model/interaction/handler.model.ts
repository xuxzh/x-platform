import { InjectionToken } from '@angular/core';
import { RhOperation, RhOperationKey } from './operation.model';
import { RhConverterHandler } from './converter.model';
import { RhSafeAny } from '@x/base/model';

/** 处理器（操作的实际执行者）定义 */
export interface RhOpHandler<T extends RhOperation>
  extends RhConverterHandler<T> {
  __xTest?: RhSafeAny;
}
/** 处理器定义集 */
export type RhOpHandlersDataset = Record<
  RhOperationKey,
  RhOpHandler<RhOperation>
>;
/** 处理器定义集的注入令牌 */
export const OP_HANDLERS_DATASET_TOKEN =
  new InjectionToken<RhOpHandlersDataset>('OP_HANDLERS_DATASET');
