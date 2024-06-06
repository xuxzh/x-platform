import { NzMessageService } from 'ng-zorro-antd/message';
import { Injectable } from '@angular/core';
import { RhStorageBase } from './storage-base';

/**
 * 存储服务
 */
@Injectable({
  providedIn: 'root',
})
export class RhStorageService extends RhStorageBase {
  constructor(msgSer: NzMessageService) {
    super(msgSer);
  }
  /**
   * 登出后清除localStorage信息
   */
  cleanLoggedInStorage() {
    // 考虑到工控端有些localStorage信息不能清空，所以不适用一键清空方法
    // this.storage.clear();
    // this.removeAppConfig();
    this.removeAuthorityData();
    // this.removeUserDomain();
    this.removeUserSession();
    this.disableUserAuthority();
  }
}
