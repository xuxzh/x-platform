import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  RhAppConfigDto,
  RhProjectConfigDto,
  RhDebugConfigDto,
  IRhFunction,
  RhSafeAny,
} from '@x/base/model';
import { KeyValue } from '@angular/common';
import { RhStorageService } from '../storage';

@Injectable({
  providedIn: 'root',
})
export class RhAppConfigService {
  private connectionErrorSubject = new BehaviorSubject<string>('');
  /** 网络连接发生错误的订阅 */
  get connectionError$() {
    return this.connectionErrorSubject.asObservable();
  }

  clearUserSessionSubject = new Subject<void>();
  get clearUserSession$() {
    return this.clearUserSessionSubject.asObservable();
  }

  // set isDebug(status: boolean) {
  //   this.appConfig?.Debug?.DeveloperMode === true;
  // }
  /** 是否显示调试组件 */
  get isDebug(): boolean {
    return this.appConfig?.Debug?.DeveloperMode === true;
  }

  get debug$() {
    return this.storage.debug$;
  }

  initProdDebug() {
    let status = this.storage.getProdDebugConfig();
    console.info(
      `当前已${
        status ? '开启' : '关闭'
      }调试模式,可通过在控制台输入EnableDebug()/DisableDebug()来开启或关闭调试模式`
    );
    (window as RhSafeAny).EnableDebug = () => {
      status = true;
      this.storage.setProdDebugConfig(status);
      return this.prodDebugTip(status);
    };
    (window as RhSafeAny).DisableDebug = () => {
      status = false;
      this.storage.setProdDebugConfig(status);
      return this.prodDebugTip(status);
    };
  }

  private prodDebugTip(status: boolean) {
    return `调试模式已${status ? '开启' : '关闭'},需手动刷新页面后生效`;
  }

  /** 是否启用生产环境调试 */
  get prodDebug(): boolean {
    return this.storage.getProdDebugConfig();
  }

  private _appConfig = {} as RhAppConfigDto;

  get appConfig(): RhAppConfigDto {
    // const appConfig = this.storage.getAppConfig();
    // return appConfig as RhAppConfigDto;
    return this._appConfig as RhAppConfigDto;
  }

  set appConfig(config: RhAppConfigDto) {
    this._appConfig = config;
    this.storage.storeAppConfig(this._appConfig);
  }

  private _functionAuthorityDatas: IRhFunction[] = [];
  /** 通用权限 */
  get functionAuthorityDatas(): IRhFunction[] {
    if (!this._functionAuthorityDatas?.length) {
      this._functionAuthorityDatas =
        this.storage.getUserSession()?.Functions || [];
    }
    return this._functionAuthorityDatas;
  }

  set functionAuthorityDatas(datas: IRhFunction[]) {
    this._functionAuthorityDatas = datas || [];
  }

  private _paraConfigDatas!: Record<string, KeyValue<string, string>[]>;

  get paraConfigDatas(): Record<string, KeyValue<string, string>[]> {
    return this._paraConfigDatas;
  }

  // private _projectConfig!: RhProjectConfigDto;

  // get projectConfig() {
  //   // 由于每个项目的projectconfig都不同，所以要读取内存中的数据，而不能读取localstorage内的数据
  //   return this._projectConfig;
  // }

  constructor(public storage: RhStorageService) {}

  /**
   * 触发网络连接错误通知
   * @param msg 通知消息
   */
  connectionErrorTrigger(msg: string) {
    this.connectionErrorSubject.next(msg);
  }

  // /**
  //  * 设置程序配置，禁止在StartupService以外的地方调用该函数
  //  * @param config 程序配置
  //  */
  // setAppConfig(config: RhAppConfigDto) {
  //   this._appConfig = config;
  //   this.storage.storeAppConfig(config);
  // }
  /**
   * 存储调试配置，禁止在`debugSnippetComponent`以外使用
   * @param config 调试配置存储
   */
  setDebugAppConfig(config: RhDebugConfigDto) {
    // this.storage.setDebugConfig(config);
    this._appConfig.Debug = config;
    this.storage.storeAppConfig(this._appConfig);
  }

  // /** 重置为服务器上的配置 */
  // resetToServerAppConfig() {
  //   const appConfig = (this.storage.getAppConfig() || {}) as RhAppConfigDto;
  //   appConfig.Debug = ObjectHelper.cloneDeep(RH_DEFAULT_DEBUG_DATA);
  //   this._appConfig = appConfig;
  //   this.storage.storeAppConfig(appConfig);
  // }

  /** 存储的用于管道和下拉框的通用数据 */
  setParaConfigDatas(datas: Record<string, KeyValue<string, string>[]>) {
    this._paraConfigDatas = datas;
  }

  /**
   * 设置项目配置，禁止在StartupService以外的地方调用该函数
   * @param config 项目配置
   */
  setProjectConfig(config: RhProjectConfigDto) {
    // eslint-disable-next-line no-console
    // console.warn('重复对projectConfig进行赋值可能导致未知错误，请仔细检查代码');
    // this._projectConfig = config;
    // this.storage.setProjectConfig(config);
    this._appConfig.Project = config;
    this.storage.storeAppConfig(this._appConfig);
  }

  /**
   * 返回用户工厂代码，如果没有，则返回`app-config.json`中的`CompanyCode`
   * @returns 工厂代码
   */
  getFactoryCode(): string {
    try {
      const factoryCode = this.storage.getFactoryCode();
      return factoryCode || this.appConfig?.System.FactoryCode;
    } catch (error) {
      return this.appConfig?.System.FactoryCode || '';
    }
  }
  /**
   * 控制台输出调试信息，仅在`this.appConfig?.Environment === 'development'`有效
   * @param msg 信息
   */
  debugInfo(msg: string) {
    if (this.appConfig?.System?.Environment === 'dev') {
      console.log(msg);
    }
  }
}
