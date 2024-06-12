import { RhSafeAny } from '@x/base/model';
import { InjectionToken } from '@angular/core';

export const X_MONACO_EDITOR_CONFIG = new InjectionToken(
  'NGX_MONACO_EDITOR_CONFIG'
);

export interface XMonacoEditorConfig {
  baseUrl?: string;
  defaultOptions?: { [key: string]: RhSafeAny };
  onMonacoLoad?: (...args: RhSafeAny) => void;
}
