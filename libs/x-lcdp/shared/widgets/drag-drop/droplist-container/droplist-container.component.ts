import { XCompRenderDirective } from './../../../directives/index';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { RhSafeAny } from '@x/base/model';
import { MsgHelper } from '@x/base/core';
import {
  XDragDropService,
  XJsonDesignerService,
  XJsonSchemaService,
  XToolbarTabsService,
} from '@x/lcdp/designer';
import {
  DesignerComponentType,
  IComponentFieldSetting,
  IComponentResource,
  IComponentSchema,
  IPageSchema,
} from '@x/lcdp/model';
import { COMPONENT_FIELD_SETTING_MAPPED } from '@x/lcdp/data';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { XPopoverDirective, XJsonMapData } from '@x/lcdp/core';
import { XPoolItemComponent } from '../pool-item/pool-item.component';

@Component({
  imports: [
    CommonModule,
    DragDropModule,
    NzPopoverModule,
    XPopoverDirective,
    XPoolItemComponent,
    XCompRenderDirective,
  ],
  selector: 'x-droplist-container',
  styleUrl: './droplist-container.component.less',
  templateUrl: './droplist-container.component.html',
  standalone: true,
})
export class XDroplistContainerComponent implements OnDestroy, AfterViewInit {
  @Input() rhData!: IComponentSchema;

  @ViewChild(CdkDropList) dropList?: CdkDropList;
  /** 是否将自身注册为`dropList` */
  registerable = true;

  dragDropService = inject(XDragDropService);

  containerStyle!: Record<string, RhSafeAny>;
  /** 设计器当前的JSON Schema数据 */
  jsonSchemaData?: IComponentSchema;

  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.isDropAllowed(drag, drop);
  };

  tabSer = inject(XToolbarTabsService);
  dragDropSer = inject(XDragDropService);
  jsonSchemaSer = inject(XJsonSchemaService);

  DragDropContainerId = '#designer-page';

  jsonDesignerSer = inject(XJsonDesignerService);

  constructor(
    // @SkipSelf()
    // @Optional()
    // @Host()
    // public jsonDesignerSer: XJsonDesignerService,
    public cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (this.dropList && this.registerable) {
      this.dragDropService.register(this.dropList);
      // console.log(this.rhData, this.dropList);
    }
  }

  ngOnDestroy(): void {
    if (this.dropList && this.registerable) {
      this.dragDropService.unregister(this.dropList);
    }
  }

  /**
   * 拖拽时的核心处理方法
   * @param event 拖拽时间
   */
  async dropped(event: CdkDragDrop<RhSafeAny>) {
    try {
      const dragData: IComponentResource | IComponentSchema = event?.item?.data;
      if (event.previousContainer === event.container) {
        // 设计器内部同一容器中拖动并调整顺序
        moveItemInArray(
          event.container.data.children,
          event.previousIndex,
          event.currentIndex
        );
        this.jsonSchemaSer.refreshSchemaData('refresh');
      } else {
        // 从组件池拖动到设计器中
        if (!this.jsonDesignerSer.isComponentSchemaDto(dragData)) {
          // TODO: 是否子页面，逻辑优化
          const isSubPage = false;
          const targetIndex = event.currentIndex;
          const offsetIndex = 0;
          const parentData = this.jsonSchemaSer.findTargetSchemaNodeData(
            XJsonMapData.getKey(this.rhData)
          ) as IPageSchema;

          const schemaDto = this.getSchemaData(
            dragData,
            {},
            COMPONENT_FIELD_SETTING_MAPPED,
            event.container.data,
            targetIndex + offsetIndex
          );
          this.jsonSchemaSer.addSchemaDataToContainer(
            schemaDto as IComponentSchema,
            isSubPage && this.tabSer.selectedTabIndex == -1
              ? void 0
              : parentData,
            targetIndex + offsetIndex
          );
        } else {
          // 设计器内部不同容器拖动
          const dragData =
            event.previousContainer.data.children[event.previousIndex];
          dragData.parent = event.container.data.key;
          transferArrayItem(
            event.previousContainer.data.children,
            event.container.data.children,
            event.previousIndex,
            event.currentIndex
          );
          this.jsonSchemaSer.refreshSchemaData('refresh');
        }
      }
      this.cdr.detectChanges();
    } catch (error) {
      MsgHelper.ShowErrorModal(`拖动时发生错误：${error}`);
    }
  }

  isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
    /** 容器组件可拖入基础表单组件 */
    // if (drop.data.compType === 'basic-form' && !ignoreNormalComponentType.find((e) => e === drag.data.name)) {
    //   return false;
    // }
    /** 仅按钮可拖入按钮组 */
    if (
      drag.data.name !== 'basic-button' &&
      drop.data.compType === 'basic-button-group'
    ) {
      return false;
    }
    /** 下拉菜单内的子菜单目前仅可以拖入通用组件 */
    if (
      drag.data.type !== 'general' &&
      drop.data.compType === 'child-dropdown-menu'
    ) {
      return false;
    }
    /** 表格项仅能在表格内拖动 */
    if (
      drag.data.type === 'table-item' &&
      drop.data.compType !== 'basic-table'
    ) {
      return false;
    }
    if (this.dragDropSer.currentHoverDropListId == null) {
      return true;
    }

    return drop.id === this.dragDropSer.currentHoverDropListId;
  }

  trackByTimeStamp(index: number): number | string {
    return index; //isNil(item?.updateTime) ? index : item.updateTime;
  }

  stopPropagation($event: Event) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
    }
  }

  /**
   * 将指定的节点数据复制一份，并插入到该节点下方
   * @param data 要复制的数据
   */
  copySchemaData(data: IComponentSchema) {
    this.jsonDesignerSer.copySchemaData(data);
  }

  /**
   * 从JSON Schema删除指定的数据
   * @param data 需要删除的数据
   */
  deleteSchemaData(data: IComponentSchema) {
    this.jsonDesignerSer.deleteNode(data);
  }

  onSelectItemChange($event: Event, data: IComponentSchema) {
    if ($event) {
      $event.preventDefault();
      $event.stopImmediatePropagation();
    }
    // TODO: 多层嵌套时的查找
    this.jsonSchemaData?.children?.forEach((ele) => {
      ele.select = ele === data;
    });
    this.jsonDesignerSer.setSelectStatusObj(data.key);
    // this.jsonSchemaSer.refreshSchemaData(this.jsonSchemaData);
    /** 忽略重复选中 */
    if (
      this.jsonDesignerSer.designerNode &&
      data.key === this.jsonDesignerSer.designerNode.key
    ) {
      return;
    }
    this.jsonDesignerSer.changeDesignerNode(data);
  }

  changeItemPosition(index: number, type: 'up' | 'down') {
    if (type === 'up') {
      moveItemInArray(
        this.rhData.children,
        index,
        index === 0 ? this.rhData.children.length - 2 : index - 1
      );
    } else {
      moveItemInArray(
        this.rhData.children,
        index,
        index === this.rhData.children.length - 2 ? 0 : index + 1
      );
    }
  }

  onSelectMapItem(key: string) {
    this.jsonDesignerSer.changeDesignerNode(
      this.jsonSchemaSer.findTargetSchemaNodeData(key) as IComponentSchema
    );
    this.jsonDesignerSer.setSelectStatusObj(key);
  }

  protected dragMoved(
    event: CdkDragMove<IComponentResource | IComponentSchema>
  ) {
    this.dragDropSer.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropSer.dragReleased(event);
  }

  private getSchemaData(
    compResourceData: IComponentResource,
    compConfig: Record<string, RhSafeAny>,
    mappedDatas: Record<DesignerComponentType, IComponentFieldSetting[]>,
    parent: IComponentSchema,
    targetIndex: number
  ): IComponentSchema {
    const wrapperSchemaData = this.jsonDesignerSer.getJsonSchema(
      compResourceData,
      targetIndex,
      compConfig,
      mappedDatas,
      parent
    ) as IComponentSchema;
    return wrapperSchemaData;
  }
}
