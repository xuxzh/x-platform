import { RhSafeAny } from './any.model';
import { XQueryDto } from './base.model';
import { IXInterfaceLocation } from './http-options.model';

/** 与后端接口交互模型的基类模型 */
export interface BaseResult {
  /** 提示信息 */
  Message: string;
  /** 是否成功标识 */
  Success: boolean;
  /** 返回或操作的记录数 */
  Record?: number;
  /** 返回总数量 */
  TotalCount?: number;
  /** 跳过的数量 */
  SkipCount?: number;
  /** 返回的操作数据 */
  Attach: RhSafeAny;

  /** 接口请求参数，用于实现`design-dynamic-table`的后端分页和更简便的数据导出 */
  requestOption?: RhDataResultRequestOption;
  /** 上下文，一般为当前组件实例(如动态form组件实例)
   * // FIXME: 是否要优化？
   */
  __context?: RhSafeAny;
  /** 是否是动态form本身触发，输入参数没有接受外部的数据
   * // FIXME: 是否要优化
   */
  pureInputPara?: boolean;
}

/** 请求配置对象 */
export type RhDataResultRequestOption = {
  /**  */
  interfaceDto?: IXInterfaceLocation;
  body: XQueryDto;
  instanceKey?: string;
  /** 分页数暂存值 */
  tempPageSize?: number;
};

/**
 * 数据结果泛型对象
 */
export class DataResultT<T> implements BaseResult {
  /** 过滤字段 */
  public DataHeadFields?: { FieldName: string; FieldDescription: string }[];
  /** 高级搜索时存储搜索Option */
  public AdvancedQueryOption?: RhSafeAny;
  /** 是否是动态form本身触发，输入参数没有接受外部的数据 */
  public pureInputPara?: boolean;
  public __context?: RhSafeAny;
  /** 接口请求参数，用于实现`design-dynamic-table`的后端分页和更简便的数据导出
   * @description `requestOption.body`即为输入参数
   */
  public requestOption?: RhDataResultRequestOption;
  /** 备注字段，前端专用 */
  public remark?: string;
  constructor(
    /** 结果信息 */
    public Message: string,
    /** 结果标志 */
    public Success: boolean,
    /** 万能传值对象 */
    public Attach: T,
    /** 返回数据量 */
    public TotalCount: number,
    /** 记录数 */
    public Record?: number,
    /** 跳过的数据量 */
    public SkipCount = 0,
    public httpRequestUrl?: string
  ) {}

  static fail(msg: string, attach?: RhSafeAny) {
    return new DataResultT(msg, false, attach, 0);
  }
  static success(msg: string, attach?: RhSafeAny) {
    const length = attach?.length ? attach.length : 1;
    return new DataResultT(msg, true, attach, length, length, length);
  }
}
