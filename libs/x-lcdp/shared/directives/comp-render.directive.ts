import {
  Directive,
  Input,
  ViewContainerRef,
  Output,
  EventEmitter,
  HostListener,
  HostBinding,
  SimpleChanges,
  OnChanges,
  ComponentRef,
} from '@angular/core';
import { XLcdpSharedService } from '../services';
import { IComponentSchema } from '@x/lcdp/model';
import { RhSafeAny, WithNil } from '@x/base/model';
import { MsgHelper, guid } from '@x/base/core';
import { COMPONENT_FIELD_SETTING_MAPPED } from '@x/lcdp/data';

/**
 * 设计时的动态渲染指令
 */
@Directive({
  selector: '[xCompRender]',
  standalone: true,
})
export class XCompRenderDirective implements OnChanges {
  @Input() xSelect = false;
  @Output() xSelectChange = new EventEmitter<boolean>();
  /** 拖动的组件对象 */
  @Input() rhComponentSchema!: IComponentSchema;
  /** 不弹出错误弹窗 */
  @Input() rhNoErrorModal = false;

  private _key: WithNil<string> = null;

  get key() {
    if (!this._key) {
      this._key = this.rhComponentSchema.key || guid();
    }
    return this._key;
  }

  @HostListener('click', ['$event.target'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick($event: Event) {
    this.xSelect = !this.xSelect;
    this.xSelectChange.emit(this.xSelect);
  }

  @HostBinding('class.active')
  get active() {
    return this.xSelect;
  }

  constructor(
    protected containerRef: ViewContainerRef,
    protected sharedSer: XLcdpSharedService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { rhComponentSchema } = changes;
    if ((rhComponentSchema?.currentValue as IComponentSchema)?.compType) {
      this.loadComponent();
    }
  }

  /**
   * 组件的动态渲染
   * @param interruptPredicate 中断组件渲染
   * @returns
   */
  protected loadComponent(
    interruptPredicate?: (targetComponent: WithNil<IComponentSchema>) => boolean
  ) {
    this.containerRef.clear();
    const targetComp = this.sharedSer.getTargetComponent(
      this.rhComponentSchema
    );
    if (!this.rhComponentSchema?.compType || !targetComp) {
      if (this.rhNoErrorModal)
        console.error(
          `该模型${this.rhComponentSchema.compType}没有关联组件实例，渲染已终止!`
        );
      return;
    }
    // // 忽略处理`template`类型组件池数据的处理
    // if (targetComp.type === 'template') {
    //   return;
    // }
    if (interruptPredicate && interruptPredicate(this.rhComponentSchema)) {
      return;
    }
    if (!targetComp.component) {
      if (!this.rhNoErrorModal)
        MsgHelper.ShowErrorModal(
          '该模型没有设置对应的component类，渲染已终止！'
        );
      return;
    }
    const componentRef = this.containerRef.createComponent(
      targetComp.component
    );
    const defaultCompConfig: Record<string, RhSafeAny> = {};
    COMPONENT_FIELD_SETTING_MAPPED[this.rhComponentSchema?.compType]?.forEach(
      (ele) => {
        defaultCompConfig[ele.name] = ele.defaultValue;
      }
    );
    let compConfig = this.rhComponentSchema?.['x-component-props'] || {};

    /** 存在组件默认属性中包含而json中不存在时，需要给一个默认赋值 */
    compConfig = { ...defaultCompConfig, ...compConfig };
    console.log(compConfig);
    const compInstance = componentRef.instance;
    Object.entries(compConfig).forEach(([key, value]) => {
      (compInstance as Record<string, RhSafeAny>)[key] = value;
      // if (Object.hasOwnProperty.call(compInstance, 'nzDanger')) {

      // }
    });
    // 所有的组件都需要设置`_nodeData`属性
    (componentRef.instance as Record<string, RhSafeAny>)['_nodeData'] =
      this.rhComponentSchema;
    this.loadCustom(componentRef);
  }

  public loadCustom(componentRef: ComponentRef<RhSafeAny>) {
    //
  }
}
