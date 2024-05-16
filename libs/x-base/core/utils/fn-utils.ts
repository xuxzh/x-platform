import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { forwardRef } from '@angular/core';
import { RhSafeAny } from '@x/base/model';
import { isEqual } from 'lodash';

/**
 * 自动生成guid
 * @param bit 要生成的guid位数,默认为`16`位
 * @description bit最大值为`32`
 */
export function guid(bit = 16): string {
  if (bit > 32) {
    bit = 32;
  }
  let target = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  if (bit && bit > 0 && bit <= 16) {
    target = target.substring(0, bit);
    if (target.lastIndexOf('-') === target.length - 1) {
      target = target.slice(0, target.length - 1) + 'y';
    }
  }
  target = target.replace(/[xy]/g, (c) => {
    const rand = (Math.random() * 16) | 0;
    const v = c === 'x' ? rand : (rand & 0x3) | 0x8;
    return v.toString(16);
  });
  return target;
}

/**
 * 使用组件本身作为提供商
 * @param component 组件
 */
export function provideValueAccessor(component: RhSafeAny) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}

export function provideValidators(component: RhSafeAny) {
  return {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}

export function isAndroidPlatform(): boolean {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Android') > -1) {
    return true;
  } else {
    return false;
  }
}

/** 复制信息 */
export function copyInfo(content: string) {
  const copyElement = document.createElement('textarea');
  copyElement.style.opacity = '0';
  copyElement.style.position = 'fixed';
  copyElement.textContent = content;
  const body = document.getElementsByTagName('body')[0];
  body.appendChild(copyElement);
  copyElement.select();
  document.execCommand('copy');
  body.removeChild(copyElement);
}

/** 什么也不干 */
export function noop(): void {
  //
}

export function functionConstructor(code: string): RhSafeAny | null {
  try {
    return Function(code);
  } catch (error) {
    return null;
  }
}

/** 将字符串中的中文逗号替换为英文逗号 */
export function handleStringComma(str: string): string {
  return str.replace(/，/g, ',');
}

/**
 * 判断给定的值是不是`null`或`undefined`
 * @param value 给定的值
 * @returns
 */
export function isNil(value: unknown): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}

/** 是否为null/undefined/''(空字符串) */
export function isNilOrEmptyString(
  value: null | undefined | RhSafeAny
): boolean {
  if (value === void 0 || value === null || value === '') {
    return true;
  } else {
    return false;
  }
}
/** 是否非null/undefined/''(空字符串) */
export function isNotNilAndEmptyString(
  value: null | undefined | RhSafeAny
): boolean {
  if (value !== void 0 && value !== null && value !== '') {
    return true;
  } else {
    return false;
  }
}

/**
 * 判定给定的对象是不是空对象`{}`
 * @param obj 需要判定的对象
 * @returns
 */
export function isEmptyObject(obj: Record<string, RhSafeAny>) {
  if (!obj) {
    return false;
  }
  return isEqual(obj, {});
}

/**
 * 是否广泛意义下的空对象，包括null/undefined/''/0/{}
 * @param value
 * @returns
 */
export function isWideEmpty(value: null | undefined | RhSafeAny) {
  return isNilOrEmptyString(value) || isEmptyObject(value);
}

/** 从形如`http://xxxxx:port/controllerName/interfaceName`网址中获取端口号 */
export function getPortFromUrl(url: string): string {
  if (!url) {
    return '';
  }
  const tempArr = url.split('/');
  const server = tempArr[2];
  if (!server) {
    return '';
  }
  return server.split(':')[1] || '';
}

/**
 * 使用正则表达式初始化angular form表单验证器
 * @param regStr 正则表达式
 * @param tip 警告信息
 * @returns angular form表单验证器
 */
