import { RhSafeAny } from '../../model/any.model';

// 类型判断
export const XIsType = (type: string) => (object: RhSafeAny) =>
  Object.prototype.toString.call(object) === `[object ${type}]`;

const IsString = XIsType('String');
const IsArray = XIsType('Array');
const IsNumber = XIsType('Number');
const IsBoolean = XIsType('Boolean');
const IsObject = XIsType('Object');
const IsNull = XIsType('Null');
const IsFunction = XIsType('Function');
const IsDate = XIsType('Date');
const IsRegExp = XIsType('RegExp');

export function XIsString(value: RhSafeAny): value is string {
  return IsString(value);
}

export function XIsArray(value: RhSafeAny): value is string {
  return IsArray(value);
}

export function XIsNumber(value: RhSafeAny): value is string {
  return IsNumber(value);
}

export function XIsBoolean(value: RhSafeAny): value is string {
  return IsBoolean(value);
}

export function XIsObject(value: RhSafeAny): value is string {
  return IsObject(value);
}

export function XIsNull(value: RhSafeAny): value is string {
  return IsNull(value);
}

export function XIsFunction(value: RhSafeAny): value is string {
  return IsFunction(value);
}

export function XIsDate(value: RhSafeAny): value is string {
  return IsDate(value);
}

export function XIsRegExp(value: RhSafeAny): value is string {
  return IsRegExp(value);
}
