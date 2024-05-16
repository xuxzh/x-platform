/* eslint-disable @angular-eslint/no-input-rename */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Host,
  Input,
  Optional,
  ElementRef,
  Output,
  EventEmitter,
  ComponentRef,
  ViewContainerRef,
  Renderer2,
  Directive,
} from '@angular/core';
import {
  isTooltipEmpty,
  NzTooltipBaseDirective,
  NzToolTipComponent,
  NzTooltipTrigger,
  PropertyMapping,
} from 'ng-zorro-antd/tooltip';
import { Directionality } from '@angular/cdk/bidi';
import {
  NzNoAnimationDirective,
  NzNoAnimationModule,
} from 'ng-zorro-antd/core/no-animation';
import {
  NzConfigKey,
  NzConfigService,
  WithConfig,
} from 'ng-zorro-antd/core/config';
import {
  BooleanInput,
  NgStyleInterface,
  NzTSType,
} from 'ng-zorro-antd/core/types';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { NZ_CONFIG_MODULE_NAME } from 'ng-zorro-antd/modal';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[x-popover]',
  exportAs: 'XPopover',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.ant-popover-open]': 'visible',
  },
})
export class XPopoverDirective extends NzTooltipBaseDirective {
  static ngAcceptInputType_nzPopoverArrowPointAtCenter: BooleanInput;

  readonly _nzModuleName: NzConfigKey = NZ_CONFIG_MODULE_NAME;

  @Input('xPopoverArrowPointAtCenter')
  @InputBoolean()
  override arrowPointAtCenter?: boolean;
  // @Input('rhPopoverTitle') override title?: NzTSType;
  @Input('xPopoverContent') override content?: NzTSType;
  @Input('x-popover') override directiveTitle?: NzTSType | null;
  @Input('xPopoverTrigger') override trigger?: NzTooltipTrigger = 'click';
  @Input('xPopoverPlacement') override placement?: string | string[] = 'bottom';
  @Input('xPopoverOrigin') override origin?: ElementRef<HTMLElement>;
  @Input('xPopoverVisible') override visible?: boolean;
  @Input('xPopoverMouseEnterDelay') override mouseEnterDelay?: number;
  @Input('xPopoverMouseLeaveDelay') override mouseLeaveDelay?: number;
  @Input('xPopoverOverlayClassName') override overlayClassName?: string;
  @Input('xPopoverOverlayStyle') override overlayStyle?: NgStyleInterface;

  @Input() @WithConfig() nzPopoverBackdrop?: boolean = false;

  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('xPopoverVisibleChange') override readonly visibleChange =
    new EventEmitter<boolean>();

  override componentRef: ComponentRef<XPopoverComponent> =
    this.hostView.createComponent(XPopoverComponent);

  protected override getProxyPropertyMap(): PropertyMapping {
    return {
      nzPopoverBackdrop: ['nzBackdrop', () => this.nzPopoverBackdrop],
      ...super.getProxyPropertyMap(),
    };
  }

  constructor(
    elementRef: ElementRef,
    hostView: ViewContainerRef,
    renderer: Renderer2,
    @Host() @Optional() noAnimation?: NzNoAnimationDirective,
    nzConfigService?: NzConfigService
  ) {
    super(elementRef, hostView, renderer, noAnimation, nzConfigService);
  }
}

@Component({
  selector: 'x-popover',
  exportAs: 'xPopoverComponent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  standalone: true,
  imports: [OverlayModule, CommonModule, NzNoAnimationModule],
  template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="hasBackdrop"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayPush]="true"
      [nzArrowPointAtCenter]="nzArrowPointAtCenter"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        class="ant-popover"
        [class.ant-popover-rtl]="dir === 'rtl'"
        style="padding:4px"
        [ngStyle]="nzOverlayStyle"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        <div class="ant-popover-content">
          <!-- <div class="ant-popover-arrow">
            <span class="ant-popover-arrow-content"></span>
          </div> -->
          <div class="ant-popover-inner" role="tooltip">
            <div class="ant-popover-inner-content" style="padding:4px">
              <ng-container *nzStringTemplateOutlet="nzContent">{{
                nzContent
              }}</ng-container>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class XPopoverComponent extends NzToolTipComponent {
  override _prefix = 'ant-popover';

  constructor(
    cdr: ChangeDetectorRef,
    @Optional() directionality: Directionality,
    @Host() @Optional() noAnimation?: NzNoAnimationDirective
  ) {
    super(cdr, directionality, noAnimation);
  }

  get hasBackdrop(): boolean {
    return this.nzTrigger === 'click' ? this.nzBackdrop : false;
  }

  protected override isEmpty(): boolean {
    return isTooltipEmpty(this.nzTitle) && isTooltipEmpty(this.nzContent);
  }
}
