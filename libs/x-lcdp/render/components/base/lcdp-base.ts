import { IComponentSchema } from '@x/lcdp/model';

export class XLcdpBase {
  _nodeData!: IComponentSchema;
  get _children() {
    return this._nodeData.children || [];
  }
}
