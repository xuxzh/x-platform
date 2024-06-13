import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { RhSafeAny } from '@x/base/model';
import { MsgHelper } from '@x/base/core';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

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
  // viewProviders: [XJsonDesignerService],
})
export class DesignerCanvasComponent extends XSchemaDataBase {
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

  constructor(public cdr: ChangeDetectorRef) {
    super();
  }

  // ngOnInit(): void {
  //   // this.jsonSchemaSer.jsonSchemaData$
  //   //   .pipe(debounceTime(200))
  //   //   .subscribe((data) => {
  //   //     this.jsonSchemaData = data;
  //   //   });
  // }
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
}
