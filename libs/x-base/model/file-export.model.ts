import { IDisplay } from './display.model';
import { WithNil } from './with-nil.model';

/** 表格前端导出字段类型 */
export type XFrontendExportTableFieldType =
  | 'string'
  | 'dateTime'
  | 'boolean'
  | 'number';

/** 动态table导出时的中英文映射表 */
export class XExportFileHeaderInfo {
  /** 字段类型 */
  public FieldValueType: WithNil<XFrontendExportTableFieldType> = 'string';
  constructor(
    /** 字段名称 */
    public FieldName: WithNil<string>,
    /** 字段中文名称 */
    public FieldDisplayName: WithNil<string>,
    /** table管道数据 */
    public PipeDatas?: IDisplay[] | null,
    /** 日期格式 */
    public DateFormat?: WithNil<string>
  ) {}
}

/**
 * 导出文件样式
 */
export class XExportFileStyle {
  constructor(
    /** 列对齐方式，默认居中对齐 */
    public ColumnAlignment = 'Center'
  ) {}

  static create() {
    return new XExportFileStyle();
  }
}
