/* eslint-disable no-console */

import { InteractConfig } from '@x/base/model';

/** 交互配置
 * @description `warn`/`error`/`log`默认只能在控制台打印日志，要进行页面交互需要先注册`interactConfig`
 * 请不要重复初始化该配置
 */
export const RH_INTERACT_CONFIG = {} as InteractConfig;

export type RhInteractType = 'msg' | 'modal';

/** 控制台打印`warn`信息
 * @param msg 要打印的信息
 * @param enableInteraction 是否启用ui交互
 * @param type ui交互类型：`msg`|`modal`
 */
export const warn = (
  msg: string,
  enableInteraction?: boolean,
  type?: RhInteractType
) => {
  console.warn(msg);
  if (enableInteraction && typeof RH_INTERACT_CONFIG?.warnMsg === 'function') {
    type = type || 'msg';
    if (type === 'msg' && typeof RH_INTERACT_CONFIG?.warnMsg === 'function') {
      RH_INTERACT_CONFIG.warnMsg(msg);
    }
    if (
      type === 'modal' &&
      typeof RH_INTERACT_CONFIG?.warnModal === 'function'
    ) {
      RH_INTERACT_CONFIG.warnModal(msg);
    }
  }
};

/** 控制台打印`error`信息 */
export const error = (
  msg: string,
  enableInteraction?: boolean,
  type?: RhInteractType
) => {
  console.error(msg);
  if (enableInteraction && typeof RH_INTERACT_CONFIG?.errorMsg === 'function') {
    type = type || 'msg';
    if (type === 'msg' && typeof RH_INTERACT_CONFIG?.errorMsg === 'function') {
      RH_INTERACT_CONFIG.errorMsg(msg);
    }
    if (
      type === 'modal' &&
      typeof RH_INTERACT_CONFIG?.errorModal === 'function'
    ) {
      RH_INTERACT_CONFIG.errorModal(msg);
    }
  }
};

/** 控制台打印`log`信息 */
export const log = (
  msg: string,
  enableInteraction?: boolean,
  type?: RhInteractType
) => {
  console.log(msg);
  if (enableInteraction) {
    type = type || 'msg';
    if (type === 'msg' && typeof RH_INTERACT_CONFIG?.logMsg === 'function') {
      RH_INTERACT_CONFIG.logMsg(msg);
    }
    if (
      type === 'modal' &&
      typeof RH_INTERACT_CONFIG?.logModal === 'function'
    ) {
      RH_INTERACT_CONFIG.logModal(msg);
    }
  }
};

export const success = (msg: string, type?: RhInteractType) => {
  type = type || 'msg';
  if (type === 'msg' && RH_INTERACT_CONFIG?.successMsg) {
    RH_INTERACT_CONFIG.successMsg(msg);
  }
  if (type === 'modal' && RH_INTERACT_CONFIG?.successModal) {
    RH_INTERACT_CONFIG.successModal(msg);
  }
};
