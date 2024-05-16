/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDays,
  addHours,
  addMonths,
  addYears,
  format,
  isPast,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  getHours,
  differenceInMinutes,
  differenceInSeconds,
  isDate,
  getMonth,
} from 'date-fns';
import { RhSafeAny } from '@x/base/model';

/**
 * 日期工具类
 */
export class DateHelper {
  /** 北京当地时间(比全球时间多八个小时)，时间问题后端已进行统一处理  */
  public static now(): Date {
    return new Date(Date.now());
  }

  public static isDate(value: any) {
    return isDate(value);
  }

  /**
   * 使用指定字符串初始化日期
   * @description 字符串需要符合日期格式
   * @param value 字符串
   */
  public static getDate(value: string): Date {
    return new Date(Date.parse(value));
  }

  /**
   * 返回给定日期加上指定小时数的日期
   * @param hours 小时数
   * @param date 给定日期
   */
  public static addHours(hours: number, date: Date): Date {
    return addHours(date, hours);
  }

  /**
   * 返回给定日期加上指定天数的日期
   * @param days 天数
   * @param date 给定日期
   */
  public static addDays(days: number, date: Date): Date {
    return addDays(date, days);
  }

  /**
   * 返回给定日期加上指定小数的日期
   * @param month 小时数
   * @param date 给定日期
   */
  public static addMonth(month: number, date: Date): Date {
    return addMonths(date, month);
  }

  /**
   * 返回给定日期加上指定年数的日期
   * @param year 年数
   * @param date 给定日期
   */
  public static addYear(year: number, date: Date): Date {
    return addYears(date, year);
  }

  /**
   * 格式化日期
   * @param date 日期
   * @param formatDate 格式，如`yyyy-MM-dd HH:mm:ss`
   * @param options 可选项
   */
  public static format(
    date: Date | number,
    formatDate = 'yyyy-MM-dd HH:mm:ss',
    options?: any
  ): string {
    // return date.toString();
    return format(date, formatDate, options);
  }

  /**
   * 是否是过去的日期
   * @param date 日期
   */
  public static IsPast(date: Date | number): boolean {
    return isPast(date);
  }

  /**
   * 返回给定日期月份的第一天
   * @param date 日期
   */
  public static startOfMonth(date: Date | number): Date {
    return startOfMonth(date);
  }

  /**
   * 返回给定日期月份的最后一天
   * @param date 日期
   */
  public static endOfMonth(date: Date | number): Date {
    return endOfMonth(date);
  }

  /**
   * 返回给定日期的周的第一天
   * @param date 日期
   */
  public static startOfWeek(
    date: Date | number,
    options = { weekStartsOn: 1 }
  ): Date {
    return startOfWeek(date, options as RhSafeAny);
  }

  /**
   * 返回给定日期的周的最后一天
   * @param date 日期
   */
  public static endOfWeek(
    date: Date | number,
    options = { weekStartsOn: 1 }
  ): Date {
    return endOfWeek(date, options as RhSafeAny);
  }

  /**
   * 返回给定日期的开始时间
   * @param date 日期
   */
  public static startOfDay(date: Date | number): Date {
    return startOfDay(date);
  }

  /**
   * 返回给定日期的结束时间
   * @param date 日期
   */
  public static endOfDay(date: Date | number): Date {
    return endOfDay(date);
  }

  public static getMonth(date: Date) {
    return getMonth(date);
  }

  /**
   * 转成当地时间(转换为北京时间)
   * @param date 日期
   * @param timeZone 时区，默认为东八区(北京时区)；
   */
  public static convertToLocalTime(date: Date, timeZone = 8): Date {
    const milliSeconds = date.getTime();
    const result = new Date(milliSeconds + timeZone * 3600000);
    return result;
  }

  /**
   * 返回给定日期的小时数
   * @example
   * ```ts
   * var result = getHours(new Date(2012, 1, 29, 11, 45))
   * ```
   * @param date 给定日期
   */
  public static getHours(date: Date): number {
    return getHours(date);
  }

  /**
   * 返回给定时间相差的分钟数
   * @param startDate 更晚的时间
   * @param endDate 更早的时间
   * @example
   * ```ts
   * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
   * var result = differenceInMinutes(
   * new Date(2014, 6, 2, 12, 20, 0),
   * new Date(2014, 6, 2, 12, 7, 59)
   * );
   * //=> 12
   * ```
   */
  public static differenceInMinutes(startDate: Date, endDate: Date): number {
    return differenceInMinutes(startDate, endDate);
  }

  /**
   * 返回给定时间相差的秒数
   * @param startDate 更晚的时间
   * @param endDate 更早的时间
   * @example
   * ```ts
   * // How many seconds are between
   * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
   * var result = differenceInSeconds(
   * new Date(2014, 6, 2, 12, 30, 20, 0),
   * new Date(2014, 6, 2, 12, 30, 7, 999)
   * );
   * //=> 12
   * ```
   */
  public static differenceInSeconds(startDate: Date, endDate: Date): number {
    return differenceInSeconds(startDate, endDate);
  }

  /** 返回给定日期的0点0分0秒 */
  public static getDateStartTime(date: Date): Date {
    return new Date(date.toLocaleDateString());
  }

  /** 返回给定日期的23点59分59秒 */
  public static getDateEndTime(date: Date): Date {
    return new Date(
      new Date(date.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
    );
  }
  /**
   * 返回前n天的日期
   * @param num 第几天
   */
  public static getPreviousDate(num: number) {
    const date = new Date();
    date.setDate(date.getDate() - num);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year + '-' + month + '-' + day;
  }
}
