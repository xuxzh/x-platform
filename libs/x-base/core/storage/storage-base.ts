import { NzMessageService } from 'ng-zorro-antd/message';
import {
  RhAppConfigDto,
  RhI18nInterface,
  RhLangType,
  RhMenuFeatureAuthorityDto,
  RhMenuNodeDto,
  RhSafeAny,
  RhUserSessionDto,
} from '@x/base/model';
import { BehaviorSubject } from 'rxjs';

export interface IDefaultSetting {
  /** 当前语言 */
  lang: {
    lang: string;
    dict?: RhI18nInterface;
  };
  layout: {
    menuCollapse: boolean;
  };
  [key: string]: RhSafeAny;
}
export class RhStorageBase {
  protected AppConfigKey = 'APP_CONFIG';
  protected thirdPartyKey = 'THIRD_PARTY';
  /** 生产环境调试键值 */
  protected prodDebugKey = 'RH_PROD_DEBUG';
  protected storage: Storage = window.localStorage;

  protected cookie = document.cookie;

  protected sessionStorage: Storage = window.sessionStorage;

  protected _defaultSetting!: IDefaultSetting;
  get defaultSetting() {
    if (!this._defaultSetting) {
      this._defaultSetting = {
        ...this.getDefaultSetting(),
        lang: {
          lang: 'zh-CN',
        },
      };
    }
    return this._defaultSetting;
  }

  /** 用户session的存储键值 */
  protected _userSessionKey = 'USER_SESSION';
  /** 锁屏前路由地址键值 */
  protected _routeBeforeLockKey = 'CURRENT_ROUTE';

  private _debugSub = new BehaviorSubject(false);
  get debug$() {
    return this._debugSub.asObservable();
  }

  get enableMultiplyFactory() {
    const appConfig = this.getAppConfig();
    return appConfig?.System?.EnableMultiplyFactory;
  }

  constructor(public msgSer: NzMessageService) {
    this._defaultSetting = this.getDefaultSetting() || {
      lang: 'zh-CN',
    };
  }

  /**
   * 获取生产环境调试配置
   */
  getProdDebugConfig() {
    return this.get(this.prodDebugKey);
  }

  /** 设置生产环境调试配置 */
  setProdDebugConfig(status: boolean) {
    this.store(this.prodDebugKey, status);
  }

  setDefaultSetting(data: IDefaultSetting): boolean {
    this._defaultSetting = data;
    this.storage.setItem(
      'DEFAULT_SETTING',
      JSON.stringify(this._defaultSetting)
    );
    return true;
  }

  getDefaultSetting(): IDefaultSetting {
    const temp =
      JSON.parse(this.storage.getItem('DEFAULT_SETTING') as string) || {};
    return temp as IDefaultSetting;
  }

  setLangDictData(data: RhI18nInterface, lang: RhLangType) {
    const defaultSetting = this.getDefaultSetting();
    defaultSetting.lang =
      typeof defaultSetting?.lang === 'string' || !defaultSetting?.lang
        ? {}
        : (defaultSetting.lang as RhSafeAny);
    defaultSetting.lang = {
      lang: lang,
      dict: data,
    };
    this.setDefaultSetting(defaultSetting);
  }

  /**
   *
   * @param key 键
   * @param value 值
   * @param omitPaths 需要忽略的字段列表
   */
  store(key: string, value: RhSafeAny | string, omitPaths?: string[]) {
    const replacer = omitPaths?.length
      ? function (key: string, value: RhSafeAny) {
          return omitPaths.indexOf(key) !== -1 ? void 0 : value;
        }
      : void 0;
    this.storage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value, replacer)
    );
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  get(key: string): RhSafeAny {
    const target = this.storage.getItem(key);
    return target ? JSON.parse(target) : null;
  }

  //  程序配置
  getAppConfig(): RhAppConfigDto | null {
    const config = this.get(this.AppConfigKey);
    return config;
  }

  /**
   *
   * @param dto
   * @param forceReplace 是否强制覆盖
   */
  storeAppConfig(dto: RhAppConfigDto) {
    const debug = dto?.Debug?.DeveloperMode;
    if (debug != null) {
      this._debugSub.next(debug);
    }
    this.storage.setItem(this.AppConfigKey, JSON.stringify(dto));
  }

  // setDebugConfig(dto: RhDebugConfigDto) {
  //   const appConfig = this.getAppConfig();
  //   if (!appConfig) {
  //     throw new Error('读取程序配置(app-config)失败!');
  //   }
  //   appConfig.Debug = dto;
  //   this.store(this.AppConfigKey, appConfig);
  // }

  removeAppConfig() {
    this.storage.removeItem(this.AppConfigKey);
  }

  // setProjectConfig(dto: RhProjectConfigDto) {
  //   // this.storage.setItem('PROJECT_CONFIG', JSON.stringify(dto));
  //   const appConfig = this.getAppConfig();
  //   if (!appConfig) {
  //     throw new Error('读取程序配置(app-config)失败!');
  //   }
  //   appConfig.Project = dto;
  //   this.store(this.AppConfigKey, appConfig);
  // }

  /**
   * 存储用户信息
   * @param userSession 用户记录
   */
  storeUserSession(userSession: RhUserSessionDto): void {
    userSession.Menus = userSession.Menus || [];
    if (this.enableMultiplyFactory) {
      this.sessionStorage.setItem(
        this._userSessionKey,
        JSON.stringify(userSession)
      );
    } else {
      this.storage.setItem(this._userSessionKey, JSON.stringify(userSession));
    }
  }

  /**
   * 以同步的方式获取用户会话信息
   * @param ignore
   * @returns
   */
  getUserSession(ignore = false): RhUserSessionDto | null {
    const key = this._userSessionKey;
    let session: string;
    if (this.enableMultiplyFactory) {
      session = this.sessionStorage.getItem(key) as string;
    } else {
      session = this.storage.getItem(key) as string;
    }
    if (session) {
      return JSON.parse(session);
    }
    if (!ignore) {
      // this.msgSer.error('当前登录用户信息已失效，请刷新页面或重新登录后重试!');
    }
    return null;
    // 刪除默认返回游客信息
    // return new RhUserSessionDto(new RhLoginedUserDto(-1, 'guest', '游客'), null);
  }

  // 清除用户会话信息
  removeUserSession(): void {
    if (this.enableMultiplyFactory) {
      this.sessionStorage.removeItem(this._userSessionKey);
    } else {
      this.storage.removeItem(this._userSessionKey);
    }
  }

  //#region 第三方授权区域
  storeThirdPartyUserSession(obj: RhUserSessionDto) {
    // 同时存储UserSession，兼容需要在低代码平台读取MOM配置
    this.store(this._userSessionKey, obj);
    this.store(this.thirdPartyKey, obj);
  }

  getThirdPartyUserSession(): RhUserSessionDto {
    return this.get(this.thirdPartyKey);
  }
  removeThirdPartyUserSession() {
    return this.remove(this.thirdPartyKey);
  }
  //#endregion 第三方授权区域结束

  //#region 锁屏前的路由信息区域
  /**
   * 获取锁屏前的路由地址
   */
  getRouteBeforeLock() {
    const route = this.storage.getItem(this._routeBeforeLockKey);
    return route;
  }

  storeRouteBeforeLock(route: string) {
    this.storage.setItem(this._routeBeforeLockKey, route);
  }

  removeRouteBeforeLock() {
    this.storage.removeItem(this._routeBeforeLockKey);
  }

  //#endregion 锁屏前的路由信息区域结束

  getFactoryCode(): string {
    const factoryCode = this.getUserSession(true)?.User?.FactoryCode;
    if (!factoryCode) {
      console.error('当前登录用户无工厂代码信息，请尝试重新登录后重试!');
    }
    return factoryCode || '';
  }

  /** 获取已登录的用户信息 */
  getUserInfo() {
    const user = this.getUserSession()?.User;
    return user;
  }

  // /**
  //  * 设置userSession内user.login的值
  //  * @param status 登录状态
  //  * @description 向已经存在的userSession里最佳当前的用户登录状态
  //  */
  // setLoginStatus(status: boolean) {
  //   try {
  //     const userSession = this.getUserSession();
  //     if (userSession?.User) {
  //       userSession.User.login = status;
  //       this.storeUserSession(userSession);
  //     }
  //   } catch (error) {
  //     throw new Error('设置用户登录状态是发成错误:UserSession.user.login');
  //   }
  // }

  //#region 用户单点登录区域

  /**
   * 启用用户单点登录控制（当`appConfig.json`的`SSOEnable`置为`true`时生效）
   * @param identifier 是否启用单点登录标识。一般存储在ProjectConfig中
   * @description 只有当`guestIdentity`的值为`AuthUser`时，才会启用单点登录控制，
   * 具体逻辑参见`[默认加载器](../net/default.interceptor.ts)`
   */
  enableUserAuthority(identifier: string) {
    // AuthUser
    this.storage.setItem('guestIdentity', identifier);
  }
  /**
   * 取消用户单点登录
   */
  disableUserAuthority() {
    this.storage.removeItem('guestIdentity');
  }

  /**
   * 获取单点登录信息
   */
  getUserAuthority(): string {
    const userIdentity = this.storage.getItem('guestIdentity');
    if (userIdentity) {
      return userIdentity;
    }
    return 'guest';
  }
  //#endregion 用户单点登录区域结束

  //#region 用户菜单权限数据区域

  /**
   * 获取当前菜单的操作权限模型
   */
  getAuthorityData(): RhMenuFeatureAuthorityDto {
    const jsonData = this.storage.getItem('AUTHORITY_DATA') as string;
    const target = JSON.parse(jsonData) as RhMenuFeatureAuthorityDto;
    return target;
  }

  /**
   * 存储当前菜单的操作权限模型
   * @param data 菜单权限数据
   */
  storeAuthorityData(data: RhMenuFeatureAuthorityDto) {
    const tempMenu = { ...data.menuDto };
    if (data?.menuDto?.parent) {
      data.menuDto = tempMenu as RhMenuNodeDto;
      tempMenu.parent = null;
    }
    this.storage.setItem('AUTHORITY_DATA', JSON.stringify(data));
  }

  /**
   * 删除当前菜单的操作权限模型
   */
  removeAuthorityData() {
    this.storage.removeItem('AUTHORITY_DATA');
  }
  //#endregion 用户菜单权限数据区域结束

  //#region DEBUG区域

  // /** 获取当前是否处于调试状态 */
  // getDebug(): boolean {
  //   const jsonData = this.storage.getItem('RH_DEBUG') as string;
  //   return JSON.parse(jsonData);
  // }

  // storeDebug(status: boolean) {
  //   this.storage.setItem('RH_DEBUG', JSON.stringify(status));
  // }

  // removeDebug() {
  //   this.storage.removeItem('RH_DEBUG');
  // }
  //#endregion DEBUG区域结束'

  //#region 主题区域
  getTheme(): string {
    //this.storage.setItem('')
    return this.storage.getItem('site-theme') || 'default';
  }

  storeTheme(theme: string) {
    this.storage.setItem('site-theme', theme);
  }

  removeTheme() {
    this.storage.removeItem('site-theme');
  }
  //#endregion 主题区域结束
}
