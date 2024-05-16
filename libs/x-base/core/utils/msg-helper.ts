import { NzNotificationDataOptions } from 'ng-zorro-antd/notification';
import { RH_INTERACT_CONFIG } from '../logger/logger';

/** loading默认持续时间设置为`3000`ms
 * @description 设置为`0`时为不主动消失
 */
const DURATION_TIME = 3000;

/**
 * 消息助手
 * @description 消息api的二次封装，解除组件与`NzModalService`和`NzMessageService`的耦合
 */
export class MsgHelper {
  // static isLogOn = JSON.parse(window.localStorage.getItem('APP_CONFIG')).isLogOn;

  //#region *********对话框提示区域*****************************************

  /**
   * 显示成功消息的模态窗口
   * @param msg 消息
   */
  public static ShowSuccessModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.successModal) {
      RH_INTERACT_CONFIG.successModal(msg);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG successModal 方法未配置');
    }
  }

  /**
   * 显示错误消息的模态窗口
   * @param msg 消息
   */
  public static ShowErrorModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.errorModal) {
      RH_INTERACT_CONFIG.errorModal(msg);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG errorModal 方法未配置');
    }
  }

  /**
   * 显示常规消息的模态窗口
   * @param msg 消息
   */
  public static ShowInfoModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.logModal) {
      RH_INTERACT_CONFIG.logModal(msg);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG logModal 方法未配置');
    }
  }

  /**
   * 显示警告消息的模态窗口
   * @param msg 消息
   */
  public static ShowWarningModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.warnModal) {
      RH_INTERACT_CONFIG.warnModal(msg);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG warnModal 方法未配置');
    }
  }

  /**
   * 显示确认模态窗口
   * @param title 标题
   * @param content 内容
   * @param okFun 点击确定后的回调函数
   */
  public static ShowConfirmModal(
    title: string,
    content: string,
    okFun: () => void | Promise<void | boolean>,
    cancelFn?: () => void,
    okType: 'primary' | 'danger' = 'primary',
    okText = 'UI.General.confirm',
    cancelText = 'UI.General.cancel'
  ) {
    if (RH_INTERACT_CONFIG?.confirm) {
      RH_INTERACT_CONFIG.confirm({
        title: `<i>${title}</i>`,
        msg: `<b>${content}</b>`,
        onOk: () => {
          okFun();
        },
        onCancel: () => {
          if (cancelFn) {
            cancelFn();
          }
        },
        okType: okType,
        okText: okText,
        cancelText: cancelText,
      });
    } else {
      this.ConsoleErrorMessage(`RH_INTERACT_CONFIG confirm ` + `方法未配置!`);
    }
  }

  /**
   * 根据传入参数，提示通用权限不足，还是菜单权限不足
   * @param isGeneralAuth 是否通用权限提示
   */
  public static ShowUnAuthModal(isGeneralAuth = false) {
    const msg = isGeneralAuth
      ? 'UI.Control.message.unFunctionTip'
      : 'UI.Control.message.unAuthTip';
    if (RH_INTERACT_CONFIG?.warnModal) {
      RH_INTERACT_CONFIG.warnModal(msg);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG warnModal 方法未配置');
    }
  }

  /**
   * 显示删除询问模态窗口
   * @param content 内容
   * @param okFun 点击确定后的回调
   * @param cancelFun 点击取消后的回调
   */
  public static ShowDeleteConfirm(
    content: string,
    okFun: () => (boolean | void) | Promise<boolean | void>,
    cancelFun?: () => (boolean | void) | Promise<boolean | void>,
    okText = 'UI.General.confirm',
    cancelText = 'UI.General.cancel'
  ) {
    if (RH_INTERACT_CONFIG?.confirm) {
      RH_INTERACT_CONFIG.confirm({
        title: '是否确认删除？',
        msg: `<b style="color: red;"> ${content}</b>`,
        okText: okText,
        okType: 'danger',
        onOk: () => {
          okFun();
        },
        cancelText: cancelText,
        onCancel: () => {
          if (cancelFun) {
            cancelFun();
          }
        },
      });
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG confirm 方法未配置');
    }
  }

  /**
   * 显示询问确认模态窗口
   * @param title 表体
   * @param content 内容
   * @param okFun 点击确定后的回调
   * @param cancelFun 点击取消后的回调
   */
  public static ShowQuestionConfirm(
    title: string,
    content: string,
    okFun: () => (boolean | void) | Promise<boolean | void>,
    cancelFun: () => (boolean | void) | Promise<boolean | void>,
    okText = 'UI.General.confirm',
    cancelText = 'UI.General.cancel'
  ): void {
    if (RH_INTERACT_CONFIG?.confirm) {
      RH_INTERACT_CONFIG.confirm({
        title: title,
        msg: `<b style="color: red;"> ${content}</b>`,
        okText: okText,
        okType: 'danger',
        onOk: () => {
          okFun();
        },
        cancelText: cancelText,
        onCancel: () => {
          cancelFun();
        },
      });
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG confirm方法未配置');
    }
  }

  //#endregion *********对话框提示区域****************************************

  //#region *****消息提示区域区域******************

  /**
   * 显示成功的提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowSuccessMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.successMsg) {
      RH_INTERACT_CONFIG.successMsg(msg, duration);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG successMsg方法未配置');
    }
  }

  /**
   * 显示提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowInfoMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.logMsg) {
      RH_INTERACT_CONFIG.logMsg(msg, duration);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG logMsg 方法未配置');
    }
  }

  /**
   * 显示提示信息
   * @param msg 消息
   */
  public static ShowTodoMessage() {
    if (RH_INTERACT_CONFIG?.logMsg) {
      RH_INTERACT_CONFIG.logMsg('施工中。。。');
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG logMsg 方法未配置');
    }
  }

  /**
   * 显示警告的提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowWarningMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.warnMsg) {
      RH_INTERACT_CONFIG.warnMsg(msg, duration);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG warnMsg 方法未配置');
    }
  }

  /**
   * 显示错误的提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowErrorMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.errorMsg) {
      RH_INTERACT_CONFIG.errorMsg(msg, duration);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG errorMsg方法未配置');
    }
  }

  /**
   * 显示Loading对话框
   * @param msg 展示信息
   * @param duration 持续时间(毫秒),当设置为0时不消失，默认为`3000`毫秒
   */
  static ShowLoadingMessage(msg: string, duration = DURATION_TIME): string {
    if (RH_INTERACT_CONFIG?.loading) {
      return RH_INTERACT_CONFIG.loading(msg, duration) || '';
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG loading 方法未配置');
      return '';
    }
  }

  /**
   * 关闭loading框
   * @param id messageId
   */
  static CloseLoadingMessage(id: string) {
    if (RH_INTERACT_CONFIG?.clearLoading) {
      RH_INTERACT_CONFIG.clearLoading(id);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG clearLoading方法未配置');
    }
  }

  /** 显示全局loading对话框，仅有一个
   * @param msg 展示信息
   * @param duration 持续时间(毫秒),当设置为0时不消失，默认为`3000`毫秒
   */
  static ShowGlobalLoadingMessage(msg: string, duration = DURATION_TIME) {
    if (RH_INTERACT_CONFIG?.loading) {
      if (!RH_INTERACT_CONFIG.loadingId) {
        RH_INTERACT_CONFIG.loading(msg, duration);
      }
      if (duration > 0) {
        setTimeout(() => {
          RH_INTERACT_CONFIG.loadingId = null;
        }, duration);
      }
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG loading 方法未配置');
    }
  }
  /**
   *  关闭全局loading对话框
   */
  static CloseGlobalLoadingMessage() {
    if (RH_INTERACT_CONFIG?.clearLoading) {
      if (RH_INTERACT_CONFIG.loadingId) {
        RH_INTERACT_CONFIG.clearLoading();
      }
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG clearLoading 方法未配置');
    }
  }
  //#endregion *****消息提示区域区域******************

  //#region notification通知区域
  static ShowInfoNotification(
    title: string,
    content: string,
    options?: NzNotificationDataOptions
  ) {
    if (RH_INTERACT_CONFIG?.logNotification) {
      RH_INTERACT_CONFIG.logNotification(title, content, options);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG errorMsg 方法未配置');
    }
  }
  static ShowSuccessNotification(
    title: string,
    content: string,
    options?: NzNotificationDataOptions
  ) {
    if (RH_INTERACT_CONFIG?.successNotification) {
      RH_INTERACT_CONFIG.successNotification(title, content, options);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG errorMsg 方法未配置');
    }
  }

  static ShowWarnNotification(
    title: string,
    content: string,
    options?: NzNotificationDataOptions
  ) {
    if (RH_INTERACT_CONFIG?.warnNotification) {
      RH_INTERACT_CONFIG.warnNotification(title, content, options);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG errorMsg 方法未配置');
    }
  }

  static ShowErrorNotification(
    title: string,
    content: string,
    options?: NzNotificationDataOptions
  ) {
    if (RH_INTERACT_CONFIG?.errorNotification) {
      RH_INTERACT_CONFIG.errorNotification(title, content, options);
    } else {
      this.ConsoleErrorMessage('RH_INTERACT_CONFIG errorMsg 方法未配置');
    }
  }
  //#endregion notification通知区域结束

  //#region console区域

  /** 控制台程序 */
  static ConsoleLogMessage(msg: string) {
    console.log(msg);
  }

  /** 控制台程序 */
  static ConsoleWarnMessage(msg: string) {
    console.warn(msg);
  }

  static ConsoleErrorMessage(msg: string) {
    console.error(msg);
  }
  //#endregion console区域结束
}
