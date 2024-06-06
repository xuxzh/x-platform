import { NzMenuModeType } from 'ng-zorro-antd/menu';
import { RhProjectConfigDto } from './project-config.model';
import { RhSafeAny } from './any.model';
/**
 * webapp 程序配置
 */
export interface RhAppConfigDto {
  /** 系统配置 */
  System: RhSystemConfigDto;
  Debug: RhDebugConfigDto;
  /** 打印配置 */
  Print: RhPrintConfigDto;
  /** 授权配置 */
  Authority: RhAuthorityConfigDto;
  /** 程序配置，即`project-config`配置(开发环境和生产环境均是) */
  Project: RhProjectConfigDto;
  Logger: RhLoggerConfigDto;
  Layout?: RhLayoutConfigDto;
}

export interface RhSystemConfigDto {
  /** 后端Api服务器地址 */
  ApiServerIp: string;
  /** 后端Api端口 */
  ApiPort: number;
  /** Node服务器Ip */
  NodeServerIp: string;
  /** Node服务端口 */
  NodePort: number;
  /** 工厂代码 */
  FactoryCode: string;
  /** 是否启用瑞辉后端服务 */
  EnableRuiHuiService: boolean;
  /** 是否启用低代码后端服务 */
  EnableLcdpService: boolean;
  /** 是否使用当前浏览器地址栏Ip作为接口请求Ip */
  IsUserSiteServerIp: boolean;
  /** 当前服务器环境：测试环境|开发环境|生产环境 */
  Environment: 'test' | 'dev' | 'prod';
  /** 是否启用多工厂 */
  EnableMultiplyFactory: boolean;
  /** 是否启用用户(存储)模式 */
  EnableUserStorageMode: boolean;
}

export interface RhAuthorityConfigDto {
  /** 是否启用单点登录 */
  SSOEnable: boolean;
  /** 是否启用用户组(授权管理模块) */
  IsUserGroupOn: boolean;
}

export interface RhPrintConfigDto {
  /** 服务器端打印相关接口api端口 */
  ServerPrintApiPort: number;
  /** 本地打印插件使用端口 */
  LocalPrintApiPort: number;
}

export interface RhLoggerConfigDto {
  IsLoggerOn: boolean;
}

export interface RhLayoutConfigDto {
  Menu: {
    Mode: NzMenuModeType;
  };
}

export interface RhDebugConfigDto {
  Mock: RhMockConfigDto;
  InterfaceIntercept: RhInterfaceInterceptOption;
  Other: RhOtherOption;
  /** 当前应用是否开启开发模式 */
  DeveloperMode: boolean;
}

export type RhDebugMode = 'port' | 'regex' | 'all';

export interface RhMockConfigDto {
  // /** 是否模拟所有接口 */
  // IsMockAll: boolean;
  /** Mock服务器地址 */
  MockServerIp: string;
  /** Mock服务端口号 */
  MockPort: number;
  /** 是否启用模拟数据功能 */
  EnableMock: boolean;
  MockMode?: RhDebugMode;
  /** 需要mock的端口列表，使用逗号分隔 */
  MockListStr?: string;
  /** 正则表达式 */
  Regex?: string;
  /** 全部拦截时的参数配置 */
  All?: RhSafeAny;
}

export interface RhInterfaceInterceptOption {
  /** 指定IP */
  InterceptServerIp: string;
  /** 是否拦截所有接口请求 */
  EnableIntercept: boolean;
  InterceptMode?: RhDebugMode;
  /** 端口列表，使用英文逗号分隔 */
  PortListStr?: string;
  /** 正则表达式 */
  Regex?: string;
  /** 全部拦截时的参数配置 */
  All?: RhSafeAny;
}

export interface RhOtherOption {
  AdvancedMode: boolean;
}
