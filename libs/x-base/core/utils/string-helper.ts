import { RhSafeAny } from '@x/base/model';
import { warn } from '../logger';

export class StringHelper {
  /** 使用逗号分隔的数字列表处理 */
  static CommaNumHandler(str?: string): number[] {
    try {
      if (!str?.trim()) {
        return [];
      }
      str = str.trim();
      const numList = str.split(',').map((ele) => Number(ele.trim()));
      if (numList.some((ele) => typeof ele !== 'number')) {
        throw new Error('参数错误，不是逗号分隔的数字列表');
      } else {
        return numList;
      }
    } catch (error: RhSafeAny) {
      warn(error?.message);
      return [];
    }
  }
}
