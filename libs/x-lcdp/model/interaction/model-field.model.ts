import { RhSafeAny } from '@x/base/model';

/** 模型字段类型 */
export type RhModelFieldType = 'number' | 'string' | 'boolean' | 'date' | 'any';
/** 模型定义 */
export class RhModel {
  /** 详细的字段列表。设计稿中目前没有存储此信息，目前只会在打开js编辑器的时候，使用Object.define动态创建并挂载，以提供代码提示。 */
  public fields?: RhModelField[];
  /** 生成的interface声明文本 */
  public declareText?: string;

  constructor(
    /** 模型构造实例用信息详情 */
    public content: string | null
  ) {}
}

/** 模型字段 */
export class RhModelField {
  /** 是否启用。禁用后，初始化时将跳过此字段 */
  public enabled = true;

  constructor(
    public key = '',
    public name = '',
    public type: RhModelFieldType = 'string',
    public isArray = false,
    public defaultValue: RhSafeAny = null
  ) {}
}
