import { isNotNil } from 'ng-zorro-antd/core/util';
// import * as _ from 'lodash';
import { cloneDeep, has, at, isEqual, pick, omit, omitBy, get } from 'lodash';
import { RhSafeAny } from '@x/base/model';

export class ObjectHelper {
  /**
   * 映射对象
   * @param source 源对象
   * @param dest 目标对象
   * @param isNullEnable 当源对象的值为null，是否需要覆盖目标对象，默认为`true`,
   * @param isForce 当目标对象没有对应属性时，是否强制赋值，默认为`true`
   * @param skipNotNullField: 当目标对象对应属性有值时，是否跳过该属性赋值,默认为`false`
   *
   * @description 默认为true,映射目标对象不存在的属性,是否强制赋值，请将`isForce`赋值为`true`
   */
  public static MapT<T1 extends object, T2 extends object>(
    source: T1,
    dest: T2,
    isNullEnable = true,
    isForce = true,
    skipNotNullField = false
  ): void {
    const keys = Object.keys(source);
    for (const key of keys) {
      if (isForce || Object.hasOwnProperty.call(dest, key)) {
        if (
          !isNullEnable &&
          (source[key as keyof typeof source] === null ||
            source[key as keyof typeof source] === void 0)
        ) {
          continue;
        }
        if (skipNotNullField && (dest as RhSafeAny)[key] != null) {
          continue;
        } else {
          (dest as RhSafeAny)[key] = source[key as keyof typeof source];
        }
      }
    }
  }

  static createNullValueObject(
    source: Record<string, unknown>
  ): Record<string, null> {
    const temp: Record<string, RhSafeAny> = {};
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        temp[key] = null;
      }
    }
    return temp;
  }

  // /**
  //  * 深度复制数组&&对象,使用自定义方法
  //  * @param source 复制对象
  //  * @deprecated 该方法请慎用，请使用`cloneDeep`方法
  //  */
  // public static deepCopy(source: RhSafeAny): RhSafeAny {
  //   if (typeof source !== 'object') {
  //     return;
  //   }

  //   const target = source instanceof Array ? [] : {};

  //   for (const key in source) {
  //     if (Object.hasOwnProperty.call(source, key)) {
  //       target[key] = typeof source === 'object' ? this.deepCopy(source[key]) : source[key];
  //     }
  //   }
  //   return target;
  // }

  /**
   * 深度复制数组&&对象, 即_.cloneDeep
   * @param value 复制对象
   */
  static cloneDeep(value: RhSafeAny) {
    return cloneDeep(value);
  }

  /** 验证给定的object是否有path指定的属性或属性数组
   * @param object 给定对象
   * @param path 给定的属性，或者属性数组
   * @example
   * ```ts
   * var object = { 'a': { 'b': { 'c': 3 } } };
   *
   * _.has(object, 'a');
   * // => true
   *
   * _.has(object, 'a.b.c');
   * // => true
   *
   * _.has(object, ['a', 'b', 'c']);
   * // => true
   * ```
   */
  public static has(
    object: Record<string, RhSafeAny>,
    path: Array<string> | string
  ): boolean {
    return has(object, path);
  }

  /**
   * 从给定对象中返回指定路径列表的值，返回值为一个数组
   * @param object 给定对象
   * @param paths 指定对象的指定路径
   * @example
   * ```ts
   * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
   * _.at(object, ['a[0].b.c', 'a[1]']);
   * // => [3, 4]
   * ```
   */
  public static at(
    object: Record<string, RhSafeAny>,
    paths: string[]
  ): RhSafeAny[] {
    return at(object, paths);
  }

  public static get(
    object: Record<string, RhSafeAny>,
    path: string | string[]
  ): RhSafeAny {
    return get(object, path);
  }

  static equal(obj1: RhSafeAny, obj2: RhSafeAny): boolean {
    return isEqual(obj1, obj2);
  }

  /** 判断object对象是否等于空对象(`{}`) */
  static isEmptyObject(obj: Record<string, RhSafeAny>) {
    if (typeof obj !== 'object') {
      return false;
    }
    return !!this.equal(obj, {});
  }

  static typeof(obj: RhSafeAny) {
    return Object.prototype.toString
      .call(obj)
      .replace(/^\[object (.+)\]$/, '$1')
      .toLowerCase();
  }

  static toBoolean(value: string | boolean): boolean | null {
    if (typeof value === 'string') {
      if (value?.trim()) {
        switch (value?.trim()) {
          case 'true':
            return true;
          case 'false':
            return false;
          case 'null':
            return null;
          default:
            return Boolean(value?.trim());
        }
      } else {
        return false;
      }
    } else {
      return Boolean(value);
    }
  }

  /** 从给定的对象中，按照给定的属性列表，组成一个新的对象并返回
   * @param obj 需要操作的对象
   * @param propertyDatas 指定的属性列表
   */
  static pick<T extends Record<string, RhSafeAny>, K extends keyof T>(
    obj: T,
    propertyDatas: K[]
  ): Partial<T> {
    return pick(obj, propertyDatas) as Partial<T>;
  }

  /** 返回属性值不为空(undefined null '')的属性列表组成的对象 */
  static compact<T extends Record<string, RhSafeAny>>(obj: T) {
    if (!obj) {
      return {};
    }
    const temp: Record<string, RhSafeAny> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const element = obj[key];
        if (isNotNil(element) && element !== '') {
          temp[key] = element;
        }
      }
    }
    return temp;
  }

  static omit<T extends Record<string, RhSafeAny>>(obj: T, paths: string[]) {
    return omit(obj, paths);
  }

  static omitBy<T extends Record<string, RhSafeAny>>(
    obj: T,
    predicate: (value: RhSafeAny) => boolean
  ) {
    return omitBy(obj, predicate);
  }

  /**
   * 给定对象和对应的属性列表，判定这些属性是否都是`null`或者`undefined`
   * @param obj 给定的对象
   * @param properties 属性列表
   * @returns
   */
  static isAllFieldNotNil<
    T extends Record<string, RhSafeAny>,
    K extends keyof T
  >(obj: T, properties?: K[]) {
    if (!properties?.length) {
      return Object.values(obj).every((ele) => ele != null);
    } else {
      return properties?.every((property) => {
        return obj?.[property] != null;
      });
    }
  }
}
