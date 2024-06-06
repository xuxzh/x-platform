import { OpMode, XBaseDto } from './base.model';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { WithNil } from './with-nil.model';
import { RhSafeAny } from './any.model';

/** 接口类型
 * @description 请使用大写的取值
 */
export type XHttpMethod = 'GET' | 'POST';

/** 接口配置模型 */
export interface IXInterfaceLocation {
  interfaceType: XHttpMethod;
  port?: WithNil<number>;
  controllerName: WithNil<string>;
  interfaceName: WithNil<string>;
  /** 接口描述 */
  description?: WithNil<string>;
  body?: RhSafeAny;
  option?: RhSafeAny;
}

export type XHttpOptions = {
  headers?:
    | HttpHeaders
    | {
        /** 是否忽略工厂代码拦截器(不会自动添加工厂代码) */
        ignoreFactoryCode?: '0' | '1';
        /** 是否忽略节流拦截器 */
        ignoreThrottle?: '0' | '1';
        /** 是否禁用错误冒泡 */
        ignoreBubble?: '0' | '1';
        [header: string]: string | string[] | RhSafeAny;
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};

/** 接口配置模型 */
export interface IRHInterfaceLocation {
  interfaceType: XHttpMethod;
  port?: WithNil<number>;
  controllerName: WithNil<string>;
  interfaceName: WithNil<string>;
  /** 接口描述 */
  description?: WithNil<string>;
  body?: RhSafeAny;
  option?: RhSafeAny;
}

/** 模块配置 */
export type RhModuleConfigCategory = 'template' | 'extension';

export class RhDevModuleConfigDto implements XBaseDto {
  /** 模块名称 */
  public ModuleName!: string;
  /**模块显示名称 */
  public ModuleDisplayName!: string;
  /** 接口请求前缀 */
  public GlobalPrefix?: string;
  /** 端口号 */
  public Port?: number;
  public ServerIp?: string;
  public opSign?: OpMode;
}

export class RhDevModelConfigDto implements XBaseDto {
  public ModelName!: string;
  public ModelDisplayName!: string;
  public ModuleName!: string;
  public ModuleDisplayName!: string;
  public Id?: number;
  /** 数据返回的properties */
  public JsonData?: RhSafeAny | string;
  public Disabled?: boolean;
  public Deleted?: boolean;
  public Remark?: string;
  public properties!: RhSafeAny[];
  public opSign?: OpMode;
}

/** 标准的瑞辉接口请求模型 */
export class RhDevInterfaceConfigDto implements XBaseDto {
  /** 接口名称 */
  public InterfaceName!: string;
  /** 接口显示名称 */
  public InterfaceDisplayName!: string;
  public InterfaceType!: XHttpMethod;
  /** 所属模块 */
  public ModuleName!: string;
  /** 所属模块显示名称 */
  public ModuleDisplayName!: string;
  /** 控制器名称 */
  public ControllerName!: string;
  public InputModelFullName?: string;
  public OutputModelFullName?: string;
  public InputParam?: RhDevModelConfigDto;
  // /** 输入参数 */
  // public InputParamJson?: string;
  /** 输出参数 */
  public OutputParam?: RhDevModelConfigDto;
  // /** 输出参数 */
  // public OutputParamJson?: string;
  public Disabled?: boolean;
  public Deleted?: boolean;
  public Remark?: string;
  /** 接口请求前缀 */
  public GlobalPrefix?: string;
  /** 端口号 */
  public Port?: number;
  public ServerIp?: string;
  /** 完整的接口请求路径，另种接口配置方式 */
  public Url?: WithNil<string>;
  /** 查询参数或者是body,由`interfaceType`决定 */
  public QueryParam?: string;
  /** 数据源管道处理 */
  public DataHandler?: string;
  public opSign?: OpMode;
}

/** 定位接口模型 */
export class RhInterfaceLocationDto implements IRHInterfaceLocation {
  /** 完整的接口请求地址url,形如`http://xxxxxx`
   * @deprecated 请避免使用这种方式定义接口请求，因为调试配置对此类接口不生效
   */
  public url?: WithNil<string>;
  public ServerIp?: string;
  public GlobalPrefix?: string;
  public ModuleName?: string;
  public port?: WithNil<number>;
  /** 接口输入参数 */
  public inputPara?: RhSafeAny;
  /** 接口描述 */
  public description?: WithNil<string>;
  constructor(
    public controllerName: WithNil<string>,
    public interfaceName: WithNil<string>,
    public interfaceType: XHttpMethod
  ) {}
  static create(): RhInterfaceLocationDto {
    return new RhInterfaceLocationDto(null, null, 'POST');
  }
}
