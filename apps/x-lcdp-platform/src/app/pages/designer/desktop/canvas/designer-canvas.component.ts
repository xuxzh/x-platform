import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  XJsonDesignerService,
  XKeyboardShortcutService,
  XToolbarTabsService,
} from '@x/lcdp/designer';
import { IRulerAndStageData } from '@x/lcdp/model';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { XSchemaDataBase } from '../base';
import {
  XCanvasWithRulerComponent,
  XDroplistContainerComponent,
} from '@x/lcdp/shared';
import { RhSafeAny, WithNil } from '@x/base/model';
import { MsgHelper } from '@x/base/core';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';

import Ruler, { RulerProps } from '@scena/ruler';

interface RulerAndStageData {
  /** 容器视口长度值 */
  ViewPortLength: number;
  /** 刻度尺的缩放值 */
  RulerZoom: number;
  /** 刻度尺的长度 */
  RulerLength: number;
}

@Component({
  selector: 'xp-designer-canvas',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    NzFormModule,
    NzInputNumberModule,
    FormsModule,
    XDroplistContainerComponent,
    XCanvasWithRulerComponent,
  ],
  templateUrl: './designer-canvas.component.html',
  styleUrl: './designer-canvas.component.less',
})
export class DesignerCanvasComponent
  extends XSchemaDataBase
  implements AfterViewInit, OnInit
{
  @ViewChild('horizontalRuler') horizontalRulerRef!: ElementRef;
  @ViewChild('verticalRuler') verticalRulerRef!: ElementRef;
  keyboardShortSer = inject(XKeyboardShortcutService);

  width = 1024;
  height = 960;
  scale = 1;
  baseViewPortWidth: number = window.screen.availWidth;
  baseViewPortHeight: number = window.screen.availHeight;
  horizontalData: IRulerAndStageData = {
    ViewPortLength: this.baseViewPortWidth,
    RulerZoom: 1,
    RulerLength: this.baseViewPortWidth,
  };

  verticalData: IRulerAndStageData = {
    ViewPortLength: this.baseViewPortHeight,
    RulerZoom: 1,
    RulerLength: this.baseViewPortHeight,
  };

  jsonDesignerSer = inject(XJsonDesignerService);
  tabSer = inject(XToolbarTabsService);

  pageStyle: Record<string, RhSafeAny> =
    this.jsonSchemaData?.['x-component-styles'] || {};

  colCount = 1;

  //#region 标尺线配置区域
  rulerBackgroundColor = '#f2f2f2';
  commonOption: RulerProps = {
    backgroundColor: this.rulerBackgroundColor,
    textColor: 'black',
  };

  horizontalRuler: WithNil<Ruler>;
  horizontalOption: RulerProps = {
    type: 'horizontal',
    ...this.commonOption,
  };

  verticalRuler: WithNil<Ruler>;
  verticalOption: RulerProps = {
    type: 'vertical',
    ...this.commonOption,
  };
  //#endregion 标尺线配置区域结束

  constructor(public cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.setRulerOption('default');
  }

  ngAfterViewInit(): void {
    //
    console.log(this.horizontalRulerRef);
  }

  initKeyboardShortcutListener(ev: KeyboardEvent) {
    //console.log(ev);
    this.keyboardShortSer.handleKeyEvent(ev);
  }

  /** 选中页面节点时进行处理 */
  onSelectPage($event: Event) {
    if ($event) {
      if (($event.target as RhSafeAny)?.tagName !== 'DIV') {
        return;
      }
      $event.preventDefault();
    }
    // 子页面设置无法选中page节点
    /*     if (this.tabSer.isEditChildTabNode) {
            return;
          } */
    // 忽略page节点的重复选中
    /*     if (this.jsonDesignerSer.designerNode?.type === 'page') {
            return;
          } */
    const targetNode =
      this.tabSer.selectedTabIndex == -1
        ? this.jsonSchemaData
        : this.jsonSchemaData.subPages?.[this.tabSer.selectedTabIndex];
    if (this.jsonDesignerSer.designerNode == targetNode || !targetNode) return;
    this.jsonDesignerSer.changeDesignerNode(targetNode);
    this.jsonDesignerSer.setSelectStatusObj(targetNode.key);
  }

  /** json拖动到容器内进行渲染 */
  onDragEnter($event: DragEvent) {
    const items = $event.dataTransfer?.items;
    const files = $event.dataTransfer?.files;
    if (items?.length === 1 && items[0].type === 'application/json') {
      const tempFile = items[0].getAsFile();
      if (tempFile) {
        this.jsonDesignerSer.loadJsonSchemaFromJsonFile(tempFile);
      }
    } else if (files?.length === 1 && files[0].type === 'application/json') {
      if (files[0]) {
        this.jsonDesignerSer.loadJsonSchemaFromJsonFile(files[0]);
      }
    } else {
      MsgHelper.ShowWarningMessage(`请拖动上传单个JSON文件！`);
    }
  }

  preventDefault($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  trackByIndex(index: number) {
    return index;
  }

  private setRulerOption(theme: string) {
    if (theme === 'dark') {
      this.rulerBackgroundColor = '#1e1e1e';
      // this.commonOption = {
      //   backgroundColor: this.rulerBackgroundColor,
      //   textColor: 'white'
      // };
      this.horizontalOption = {
        type: 'horizontal',
        backgroundColor: this.rulerBackgroundColor,
        textColor: 'white',
      };
      this.verticalOption = {
        type: 'vertical',
        backgroundColor: this.rulerBackgroundColor,
        textColor: 'white',
      };
    } else {
      this.rulerBackgroundColor = '#f2f2f2';
      // this.commonOption = {
      //   backgroundColor: this.rulerBackgroundColor,
      //   textColor: 'black'
      // };
      this.horizontalOption = {
        type: 'horizontal',
        backgroundColor: this.rulerBackgroundColor,
        textColor: 'black',
      };
      this.verticalOption = {
        type: 'vertical',
        backgroundColor: this.rulerBackgroundColor,
        textColor: 'black',
      };
    }
    this.updateRulerAndViewport();
  }

  private updateRulerAndViewport(
    pageWidth: number = this.width,
    pageHeight: number = this.height,
    pageZoom: number = this.scale
  ) {
    this.calcRulerData(
      this.baseViewPortWidth,
      pageZoom,
      pageWidth + 50,
      this.horizontalData
    );
    this.horizontalOption.zoom = this.horizontalData.RulerZoom;
    this.horizontalOption.width = this.horizontalData.RulerLength;
    this.calcRulerData(
      this.baseViewPortHeight,
      pageZoom,
      pageHeight + 50,
      this.verticalData
    );
    this.verticalOption.zoom = this.verticalData.RulerZoom;
    this.verticalOption.height = this.verticalData.RulerLength;
    //console.log(this.horizontalData,this.verticalData);
    setTimeout(() => {
      try {
        this.horizontalRuler?.destroy();
        this.verticalRuler?.destroy();
        this.horizontalRuler = new Ruler(
          this.horizontalRulerRef.nativeElement,
          this.horizontalOption
        );
        this.verticalRuler = new Ruler(
          this.verticalRulerRef.nativeElement,
          this.verticalOption
        );
        this.cdr.detectChanges();
      } catch (error) {
        //眼不见为净。源码里面`var provider = container.__REACT_COMPAT__;`缺少?判断，container可能为空。
      }
    }, 10);
  }

  private calcRulerData(
    viewPortSize: number,
    scale: number,
    pageSize: number,
    data: RulerAndStageData
  ) {
    if (pageSize * scale <= viewPortSize) {
      data.RulerZoom = scale;
      data.ViewPortLength = viewPortSize;
      data.RulerLength = viewPortSize;
    } else {
      data.RulerZoom = scale;
      data.ViewPortLength = pageSize * scale;
      data.RulerLength = data.ViewPortLength;
    }
  }
}
