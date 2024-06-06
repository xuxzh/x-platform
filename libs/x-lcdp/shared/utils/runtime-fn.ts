import { Type } from '@angular/core';
import { RhSafeAny } from '@x/base/model';
export type Constructor<T> = new (...args: RhSafeAny[]) => T;

export function Runtime<T extends Constructor<Type<RhSafeAny>>>(
  constructor: T
) {
  return class extends constructor {
    runtime: runt;
  };
}
