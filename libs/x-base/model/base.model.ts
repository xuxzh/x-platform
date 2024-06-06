/**
 * 操作模式
 */
export enum OpMode {
  /** 数据新增(1) */
  OpAdd = 1,
  /** 数据编辑(2) */
  OpEdit = 2,
  /** 数据删除(-1) */
  OpDelete = -1,
  /** 批量导入时使用 删除原有全部数据后导入，慎用*/
  OpAddAfterDeleteAll = -100,
}

export interface XBaseDto {
  opSign?: OpMode;
}

export interface XQueryDto {
  isPaged?: boolean;
}
