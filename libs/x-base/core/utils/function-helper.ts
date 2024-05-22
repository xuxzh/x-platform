import { RhSafeAny } from '@x/base/model';
import { debounce, throttle, isNil } from 'lodash';
import { isNotNil } from 'ng-zorro-antd/core/util';
import { MsgHelper } from './msg-helper';

/**
 * 函数工具类
 */
export class FunctionHelper {
  /** 将指定函数转换为防抖函数 */
  static debounce(func: (...args: RhSafeAny) => void, wait = 0, options = {}) {
    return debounce(func, wait, options);
  }

  /** 将指定函数转换为节流函数 */
  static throttle(func: () => void, wait = 0, options = {}) {
    return throttle(func, wait, options);
  }

  /** 检查目标值是否是null或者undefined */
  static isNil(data: RhSafeAny) {
    return isNil(data);
  }

  /** 将制定的信息复制到剪贴板 */
  static copyInfo(content: string) {
    const copyElement = document.createElement('textarea');
    copyElement.style.opacity = '0';
    copyElement.style.position = 'fixed';
    copyElement.textContent = content;
    const body = document.getElementsByTagName('body')[0];
    body.appendChild(copyElement);
    copyElement.select();
    document.execCommand('copy');
    body.removeChild(copyElement);
    MsgHelper.ShowSuccessMessage('复制成功！');
  }

  static booleanHandler(value: boolean) {
    return isNotNil(value) ? (value === true ? '是' : '否') : value;
  }
}
