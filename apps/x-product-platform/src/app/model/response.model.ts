import { RhSafeAny } from './any.model';

export interface IResponseDto<T extends RhSafeAny> {
  /** 响应标识 */
  success: boolean;
  /** 状态码 */
  statusCode: number;
  /** 响应信息 */
  message: string;
  data: T;
  /** 时间戳（响应时间） */
  timestamp?: Date;
  /** 请求路径 */
  path?: string;
}
