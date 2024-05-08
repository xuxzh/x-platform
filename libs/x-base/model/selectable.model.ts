import { RhSafeAny } from './any.model';

export interface ISelectableDto {
  check?: boolean;
  select?: boolean;
  expand?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  [prop: string]: RhSafeAny;
}
