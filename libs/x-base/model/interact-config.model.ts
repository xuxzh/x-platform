import {
  NzNotificationDataOptions,
  NzNotificationRef,
} from 'ng-zorro-antd/notification';

/** 交互配置，用于提示和界面交互提示 */
export interface InteractConfig {
  warnMsg?: (msg: string, duration?: number) => void;
  warnNotification: (
    title: string,
    content: string,
    option?: NzNotificationDataOptions
  ) => NzNotificationRef;
  warnModal?: (msg: string) => void;
  errorMsg?: (msg: string, duration?: number) => void;
  errorNotification: (
    title: string,
    content: string,
    option?: NzNotificationDataOptions
  ) => NzNotificationRef;
  errorModal?: (msg: string) => void;
  logMsg?: (msg: string, duration?: number) => void;
  logNotification: (
    title: string,
    content: string,
    option?: NzNotificationDataOptions
  ) => NzNotificationRef;
  logModal?: (msg: string) => void;
  successMsg?: (msg: string, duration?: number) => void;
  successNotification: (
    title: string,
    content: string,
    option?: NzNotificationDataOptions
  ) => NzNotificationRef;
  successModal?: (msg: string) => void;
  confirm?: (config: {
    title: string;
    msg: string;
    onOk: () => void;
    onCancel: () => void;
    okType: 'primary' | 'danger';
    okText: string;
    cancelText: string;
  }) => void;
  /** 显示Loading信息框
   * @param msg 需要显示的信息
   * @param ms 持续时间
   */
  loading?: (msg: string, duration: number) => void | string;
  clearLoading?: (id?: string) => void;
  /** loading对话框的id */
  loadingId?: string | null;
}
