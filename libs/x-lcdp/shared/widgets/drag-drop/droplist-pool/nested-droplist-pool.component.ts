import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import type {
  CdkDragRelease,
  CdkDrag,
  CdkDragMove,
  CdkDropList,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { XDragDropService } from '@x/lcdp/designer';
import { IComponentResource, IComponentSchema } from '@x/lcdp/model';
import { RhSafeAny } from '@x/base/model';
import { XPoolItemComponent } from '../pool-item/pool-item.component';

@Component({
  selector: 'x-nested-droplist-pool',
  standalone: true,
  imports: [CommonModule, DragDropModule, XPoolItemComponent],
  templateUrl: './nested-droplist-pool.component.html',
  styleUrl: './nested-droplist-pool.component.less',
})
export class NestedDroplistPoolComponent {
  @Input() rhData!: IComponentResource;
  @Input() rhCustomItemContentTpl?: TemplateRef<RhSafeAny>;

  /** 当将组件池item拖动到设计器内部时，会触发该事件 */
  @Output() rhDragToDesigner = new EventEmitter<IComponentResource>();

  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.isDropAllowed(drag, drop);
  };

  DragDropContainerId = '#designer-page';

  constructor(public dragDropSer: XDragDropService) {
    //
  }

  dropped(event: CdkDragDrop<RhSafeAny>) {
    //
  }

  protected isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
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

  protected dragMoved(
    event: CdkDragMove<IComponentResource | IComponentSchema>
  ) {
    this.dragDropSer.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropSer.dragReleased(event);
    const target = event.event.target;
    // 判定是否拖动到了设计器内部
    if ((target as Element)?.closest(this.DragDropContainerId)) {
      this.rhDragToDesigner.emit(event.source.data);
    }
  }
}
