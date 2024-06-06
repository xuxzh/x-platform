import { IXSelectable } from './selectable.model';

export interface IDisplay extends IXSelectable {
  /** 名称 */
  name: string;
  /** 显示名称 */
  displayName: string;
  /** 描述 */
  description?: string;
}
export type IDisplayWithIcon = IDisplay & { icon: string };
