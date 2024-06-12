import { RhSafeAny } from '@x/base/model';
export interface RhDiffEditorModel {
  code: string;
  language: string;
}
export interface RhEditorModel {
  value: string;
  language?: string;
  uri?: RhSafeAny;
}
