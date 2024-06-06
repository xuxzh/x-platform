import { RhSafeAny } from '@x/base/model';
import * as _ from 'lodash';

/**
 * 数组工具类
 */
export class ArrayHelper {
  /**
   * 选中对应项
   * @param list 目标数组
   * @param item 要选定的项
   * @param ptyName 指示记录是否选中的属性名字，默认为`select`
   */
  public static setSelectedItemStatus<
    T extends Record<string, RhSafeAny>,
    K extends keyof T
  >(list: T[], item: T, ptyName: K): void {
    list.forEach((ele) => {
      (ele as RhSafeAny)[ptyName] = false;
    });
    (item as RhSafeAny)[ptyName] = true;
  }

  /**
   * 获取给定数据所在的table页码
   * @param dataset table的数据源
   * @param propertyName 用于定位的属性名称
   * @param value 用于定位的属性值
   * @param pageSize 每页的数据量
   */
  public static getPageIndexOfTable<T, K extends keyof T>(
    dataset: Array<T>,
    propertyName: K,
    value: string | number,
    pageSize: number
  ) {
    let pageIndex = 1;
    const index = dataset.findIndex((item) => item[propertyName] === value);
    if (index !== -1) {
      pageIndex = Math.ceil((index + 1) / pageSize);
    }
    return pageIndex;
  }

  /**
   * 向数组中添加或更新对象
   * @param list 目标数组
   * @param dto 要添加的对象
   * @param predicate 定位到该对象的方法
   * @param isFirst 是否加到头部,默认为`true`,
   * @param forceUpdate 当`predicate`为`true`时，是否强制更新，默认为`false`
   * @description 当目标数组已存在该对象，可选忽略或者更新；不存在则将该对象添加到目标数组
   */
  public static addTo<T>(
    list: T[],
    dto: T,
    predicate: (this: void, value: T, index: number, obj: Array<T>) => boolean,
    isFirst = true,
    forceUpdate = false
  ): T[] {
    const datas = list;
    const index = list.findIndex(predicate);
    if (index === -1) {
      isFirst ? list.unshift(dto) : list.push(dto);
    } else if (forceUpdate) {
      // 更新对象
      datas.splice(index, 1, dto);
    }
    list = [...datas];
    return list;
  }

  /**
   * 移除数组中的元素
   * @param list 目标数组
   * @param predicate 定位到要删除元素的方法
   */
  public static remove<T>(
    list: T[],
    predicate: (this: void, value: T, index: number, obj: Array<T>) => boolean
  ): T[] {
    const dataset = list;
    _.remove(list, predicate as RhSafeAny);
    list = [...dataset];
    return list;
  }

  /**
   * 使用给定的长度分割源数组，返回分割后的二维数组。
   * @param array 源数组
   * @param size 数组长度
   */
  public static chunk(array: RhSafeAny[], size = 1) {
    return _.chunk(array, size);
  }

  /**
   * 从给定的数组中筛选不重复的值，并返回新的数组
   * @param array 给定数组
   */
  public static uniq<T>(array: Array<T>): Array<T> {
    return _.uniq(array);
  }

  /**
   * 使用给定的比较器比较数组中的每个数组，并返回由不重复值组成的新数组
   * @param array 给定数组
   * @param comparator 自定义比较器
   */
  public static uniqWith<T>(
    array: Array<T>,
    comparator: (object: RhSafeAny, other: RhSafeAny) => boolean
  ): Array<T> {
    return _.uniqWith(array, comparator);
  }

  /**
   * 筛选给定数组内值为true(除去false, null, 0, "", undefined, 和 NaN)的成员组成的新数组
   * @param array 给定的数组
   * @example
   */
  public static compact<T>(array: Array<T>): Array<T> {
    return _.compact(array);
  }

  /**
   * 使用目标数字筛选源数组中缺少的元素组成的数组，并返回。
   */
  public static differenceBy<T>(
    source: Array<T>,
    target: Array<T>,
    propertyName: string
  ) {
    return _.differenceBy(source, target, propertyName as RhSafeAny);
  }

  static drop(arr: Array<RhSafeAny>, count = 1) {
    return _.drop(arr, count);
  }

  static dropRight(arr: Array<RhSafeAny>, count = 1) {
    return _.dropRight(arr, count);
  }

  static take(arr: Array<RhSafeAny>, count = 1) {
    return _.take(arr, count);
  }

  static takeRight(arr: Array<RhSafeAny>, count = 1) {
    return _.takeRight(arr, count);
  }
  /** 拼接两个数组 */
  static concat(arr1: Array<RhSafeAny>, arr2: Array<RhSafeAny>) {
    return _.concat(arr1, arr2);
  }
}
