import { Inject, Injectable } from '@angular/core';
import {
  CdkDropList,
  CdkDragMove,
  CdkDragRelease,
} from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { RhSafeAny } from '@x/base/model';

/**
 * 拖放服务，用于维护droplist的相互连接关系
 * @description 该服务会统一管理界面中的`droplist`实例，并动态维护每个`droplist`可以拖动到的其他`droplist`:`cdkDropListConnectedTo`
 */
@Injectable({
  providedIn: 'root',
})
export class RhDragDropService {
  #dropLists: CdkDropList[] = [];

  get dropLists(): CdkDropList[] {
    return this.#dropLists;
  }

  /** 定位当前hover过的DropList的id值 */
  currentHoverDropListId?: string;

  constructor(@Inject(DOCUMENT) private document: Document) {
    //
  }

  public register(dropList: CdkDropList) {
    this.dropLists.push(dropList);
    // FIXME: 刷新次数频繁问题
    // console.log(this.dropLists);
  }

  public unregister(dropList: CdkDropList) {
    // this.dropLists = ArrayHelper.remove(this.dropLists, (ele) => ele.id === dropList.id);
    const targetIndex = this.dropLists.findIndex(
      (ele) => ele.id === dropList.id
    );
    this.dropLists.splice(targetIndex, 1);
  }

  dragMoved(event: CdkDragMove<RhSafeAny>) {
    const elementFromPoint = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!elementFromPoint) {
      this.currentHoverDropListId = undefined;
      return;
    }

    const dropList = elementFromPoint.classList.contains('cdk-drop-list')
      ? elementFromPoint
      : elementFromPoint.closest('.cdk-drop-list');

    if (!dropList) {
      this.currentHoverDropListId = undefined;
      return;
    }

    this.currentHoverDropListId = dropList.id;
  }

  dragReleased(event: CdkDragRelease) {
    this.currentHoverDropListId = undefined;
  }
}
