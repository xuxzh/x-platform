import { SimpleChange } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { RhSafeAny, WithNil } from '@x/base/model';
import { RhAbstractRuntime } from './runtime.model';
import { IComponentSchema } from '../designer.model';
import { RhEvent } from './event.model';

/** 组件基类 */
export abstract class RhAbstractComponent<T> implements ControlValueAccessor {
  rhDisabled!: boolean;
  protected _value: string | number | RhSafeAny;
  protected _oldValue: string | number | RhSafeAny;
  get value() {
    return this._value;
  }
  set value(value: WithNil<string | number | RhSafeAny>) {
    // console.log(`基类${this.schema?.displayName}值变化：旧值, 中间值, 新值`, this._oldValue, this._value, value);
    this._oldValue = this._value;
    this._value = value;
    if (this._oldValue !== this._value) {
      // 当旧的值不等于新值时才触发onchange方法；
      this.onChange ? this.onChange(value) : null;
      this.valueChanged.emit(value);
    }
    if (this.valueHandler) {
      this.valueHandler.call(this, this.value);
    }
  }
  /** value赋值之后的处理函数 */
  valueHandler: (value: WithNil<string | number | RhSafeAny>) => void = () => {
    //
  };

  onChange: (value: WithNil<string | number | RhSafeAny>) => void = () => {
    //
  };
  onTouched: (value: WithNil<string | number | RhSafeAny>) => void = () => {
    //
  };
  /** 由渲染指令传入的runtime */
  public abstract runtime: RhAbstractRuntime<RhSafeAny>;
  /** 组件对应的schema */
  public schema!: IComponentSchema;
  /** 是否更新传入属性后再更新value */
  public updateDataAfterProps = true;
  /** 记录每个属性是否已完成第一次update */
  private firstChangesSet: Set<string> = new Set();
  /** 外部传入宿主数据 */
  public rhHostData: RhSafeAny;
  /** 外部传入附加数据 */
  public rhExtraData: RhSafeAny;

  get view() {
    return (this.cdr as RhSafeAny)._lView[0];
  }

  constructor(public cdr: ChangeDetectorRef) {}

  /** 处理属性更新，内部会检查宿主是否有ngOnChanges实现，如果有，会模拟触发一个changes */
  public updateProps(props: Partial<Record<keyof T, RhSafeAny>>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance: RhSafeAny = this;
    if (instance['ngOnChanges']) {
      const changes = Object.keys(props).reduce((obj, key) => {
        obj[key] = new SimpleChange(
          instance[key],
          (props as RhSafeAny)[key],
          !this.firstChangesSet.has(key)
        );
        this.firstChangesSet.add(key);
        return obj;
      }, {} as SimpleChanges);
      instance['ngOnChanges'](changes);
    }
    Object.assign(this, props);
  }

  /** 接收更新内容，设置到组件实例上 */
  public update(inputs: Partial<Record<keyof T, RhSafeAny>>) {
    this.cdr.detach();
    if (Object.prototype.hasOwnProperty.call(inputs, 'value')) {
      const newValue = (inputs as RhSafeAny).value;
      delete (inputs as RhSafeAny).value;
      if (this.updateDataAfterProps) {
        this.updateProps(inputs);
        this.value = newValue;
      } else {
        this.value = newValue;
        this.updateProps(inputs);
      }
    } else {
      this.updateProps(inputs);
    }
    this.cdr.reattach();
    this.cdr.markForCheck();
  }
  /** 实现一个统一的outputs输出口，用来对外输出事件 */
  public outputs: EventEmitter<RhEvent> = new EventEmitter();
  /** 值变更 */
  public valueChanged: EventEmitter<RhSafeAny> = new EventEmitter();

  /** 取得期望的真实数据。可由子类定制返回结果。用于【取出某个对象的数据】操作等场景下取出当前数据 */
  public getCurrentRealValue() {
    return this.value;
  }

  clearValue() {
    this.value = null;
  }

  //#region control value accessor区域
  writeValue(obj: string | number): void {
    this.value = obj;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: RhSafeAny): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: RhSafeAny): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.rhDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  //#endregion control value accessor区域结束
}
