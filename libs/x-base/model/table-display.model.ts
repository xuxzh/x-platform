import { IDisplay } from './display.model';
import { WithNil } from './with-nil.model';

/** Table展示模型 */
export interface ITableDisplay {
  pipeDatas: WithNil<IDisplay[]>;
  /** 表头标题 */
  header: string;
  /** 标题字段 */
  field: string;
  /** 字段类型 */
  type: 'string' | 'number' | 'date' | string;
  /** 管道 */
  pipe?: (p: string | Date) => string;
  /** 可见性 */
  visible: boolean;
  /** 宽度 */
  width: number;
  /** 字段是否可编辑 */
  editable: boolean;
  /** 编辑确认后是否触发回调 */
  editcallback: boolean;
  /** 是否固定 */
  fixed: 'left' | 'right' | 'normal';
  /** 固定宽度，需要根据在数组中的位置计算 */
  fixedWidth?: number;
}
