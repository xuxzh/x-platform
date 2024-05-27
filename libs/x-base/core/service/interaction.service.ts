import { NzModalService } from 'ng-zorro-antd/modal';
import { Injectable, inject } from '@angular/core';
import { RH_INTERACT_CONFIG } from '../logger';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import type { NzNotificationDataOptions } from 'ng-zorro-antd/notification';
import { noop } from '../utils';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class XInteractionService {
  private nzModalSer = inject(NzModalService);
  private nzMsgSer = inject(NzMessageService);
  private notificationSer = inject(NzNotificationService);
  initInteractionConfig() {
    // 信息提示
    RH_INTERACT_CONFIG.logModal = (msg: string) => {
      this.nzModalSer.info({
        nzTitle: '温馨提示',
        nzContent: msg,
        nzOkText: '确定',
      });
    };

    RH_INTERACT_CONFIG.logMsg = (msg: string, duration?: number) => {
      this.nzMsgSer.info(msg, {
        nzDuration: duration || 3000,
      });
    };

    RH_INTERACT_CONFIG.logNotification = (
      title: string,
      content: string,
      options?: NzNotificationDataOptions
    ) => {
      return this.notificationSer.create('info', title, content, options);
    };

    // 警告提示
    RH_INTERACT_CONFIG.warnModal = (msg: string) => {
      this.nzModalSer.warning({
        nzTitle: '警告',
        nzContent: msg,
        nzOkText: '确定',
      });
    };
    RH_INTERACT_CONFIG.warnMsg = (msg: string, duration?: number) => {
      this.nzMsgSer.warning(msg, { nzDuration: duration || 3000 });
    };

    RH_INTERACT_CONFIG.warnNotification = (
      title: string,
      content: string,
      options?: NzNotificationDataOptions
    ) => {
      return this.notificationSer.create('warning', title, content, options);
    };

    // 错误提示
    RH_INTERACT_CONFIG.errorModal = (msg: string) => {
      this.nzModalSer.error({
        nzTitle: '错误提示',
        nzContent: msg,
        nzOkText: '确定',
      });
    };
    RH_INTERACT_CONFIG.errorMsg = (msg: string, duration?: number) => {
      this.nzMsgSer.error(msg, { nzDuration: duration || 3000 });
    };

    RH_INTERACT_CONFIG.errorNotification = (
      title: string,
      content: string,
      options?: NzNotificationDataOptions
    ) => {
      return this.notificationSer.create('error', title, content, options);
    };

    // 成功提示
    RH_INTERACT_CONFIG.successModal = (msg: string) => {
      this.nzModalSer.success({
        nzTitle: '成功提示',
        nzContent: msg,
        nzOkText: '确定',
      });
    };
    RH_INTERACT_CONFIG.successMsg = (msg: string, duration?: number) => {
      this.nzMsgSer.success(msg, { nzDuration: duration || 3000 });
    };

    RH_INTERACT_CONFIG.successNotification = (
      title: string,
      content: string,
      options?: NzNotificationDataOptions
    ) => {
      return this.notificationSer.create('success', title, content, options);
    };

    RH_INTERACT_CONFIG.confirm = (config) => {
      this.nzModalSer.confirm({
        nzTitle: config.title,
        nzContent: config.msg,
        nzOkType: config.okType == 'danger' ? 'primary' : config.okType,
        nzOkDanger: config.okType == 'danger',
        nzOnOk: () => {
          config?.onOk ? config.onOk() : noop();
        },
        nzOnCancel: () => {
          config?.onCancel ? config?.onCancel() : noop();
        },
        nzOkText: config?.okText,
        nzCancelText: config?.cancelText,
      });
    };

    RH_INTERACT_CONFIG.loading = (msg: string, duration = 0) => {
      const msgRef = this.nzMsgSer.loading(msg, { nzDuration: duration });
      firstValueFrom(msgRef.onClose).then(() => {
        RH_INTERACT_CONFIG.clearLoading &&
          RH_INTERACT_CONFIG.clearLoading(msgRef.messageId);
      });
      if (!RH_INTERACT_CONFIG.loadingId) {
        RH_INTERACT_CONFIG.loadingId = msgRef.messageId;
      }
      return msgRef.messageId;
    };

    RH_INTERACT_CONFIG.clearLoading = (id?: string) => {
      if (RH_INTERACT_CONFIG.loadingId) {
        this.nzMsgSer.remove(id || RH_INTERACT_CONFIG.loadingId);
        RH_INTERACT_CONFIG.loadingId = null;
      }
    };
  }
}
