import { RhSafeAny } from './any.model';

export interface RhI18nInterface {
  /** 区域设置 */
  locale: string;
  [prop: string]: RhSafeAny;
}

export type RhLangType = 'zh_CN' | 'en_US';
