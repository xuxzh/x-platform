import { ISelectableDto } from './selectable.model';

export interface IDisplay extends ISelectableDto {
  name: string;
  displayName: string;
  description?: string;
}
export type RhDisplayWithIcon = IDisplay & { icon: string };
