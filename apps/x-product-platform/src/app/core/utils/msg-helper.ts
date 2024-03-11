import { Injectable, inject } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

export class MsgHelper {
  static ShowSuccessMsg(msg: string) {
    //
  }
}

@Injectable()
export class MsgHelperService {
  modalSer = inject(NzModalService);
  msgSer = inject(NzMessageService);
  showSuccessMsg(msg: string) {
    this.msgSer.success(msg);
  }
  showWarningMsg(msg: string) {
    this.msgSer.warning(msg);
  }

  showInfoMsg(msg: string) {
    this.msgSer.info(msg);
  }
  showErrorMsg(msg: string) {
    this.msgSer.error(msg);
  }
}
