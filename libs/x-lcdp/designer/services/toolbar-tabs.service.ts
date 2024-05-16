import { Injectable } from '@angular/core';

/**
 * 工具栏tabset服务
 */
@Injectable()
export class XToolbarTabsService {
  selectedTabIndex = -1;

  constructor() {
    //
  }

  resetTatSetDatas() {
    this.selectedTabIndex = -1;
  }
}
