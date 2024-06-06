import { RhModelField, RhModelFieldType } from './model-field.model';

/** 变量定义 */
export class RhVariable extends RhModelField {
  constructor(
    public override key = '',
    public override name = '',
    public override type: RhModelFieldType = 'any',
    public override isArray = false,
    public override defaultValue = null,
    public isConst = false
  ) {
    super();
  }
}
