import { HttpClient } from '@angular/common/http';
import {
  RhAppConfigDto,
  RhDevModuleConfigDto,
  RhInterfaceLocationDto,
  RhSafeAny,
  WithNil,
  XHttpMethod,
} from '@x/base/model';
import { firstValueFrom, from, map, Observable, of, tap } from 'rxjs';
import { MsgHelper, noop } from '../utils';
import { RhAppConfigService } from './app-config.service';
import { XHttpOptions } from '@x/base/model';
import { Inject, isDevMode, Optional } from '@angular/core';
import { StringHelper } from '../utils/string-helper';
import { RhLoggerService, warn } from '../logger';
import { DataResultT } from '@x/base/model/operate.mode';

/** 低代码平台模块名称 */
export const LCDP_MODULE_NAME = 'LCDP';

export class RhApiConfigBase {
  get config(): RhAppConfigDto {
    return this.appConfigSer.appConfig;
  }
  isLoggerOn = false;

  private _lcdpModuleConfigDataSet: Record<string, RhDevModuleConfigDto> = {};

  constructor(
    public http: HttpClient,
    public appConfigSer: RhAppConfigService,
    public logger: RhLoggerService
  ) {
    this.isLoggerOn = this.config?.Logger?.IsLoggerOn || false;
  }

  //#region lcdp 接口区域
  /**
   * 通用nest接口post调用
   */
  postLcdp<InputT, OutT>(
    ctlName: string,
    actionName: string,
    dto?: InputT,
    options?: XHttpOptions
  ): Observable<RhSafeAny> {
    const url = this.getLcdpApi(ctlName, actionName);
    if (this.isLoggerOn) {
      this.printLogInfo(url, dto);
    }
    return this.http.post<OutT>(url, dto, options);
  }

  /**
   * 通用nest接口get调用
   */
  getLcdp<OutT>(ctrlName: string, actionName: string, options?: XHttpOptions) {
    const url = this.getLcdpApi(ctrlName, actionName);
    return this.http.get<OutT>(url, options);
  }

  private getLcdpApi(ctlName: string, actionName: string) {
    if (!this.config?.System?.NodeServerIp || !this.config?.System?.NodePort) {
      throw new Error('低代码服务或端口未配置，请检查后重试！');
    }
    return `http://${this.config.System.NodeServerIp}:${this.config.System.NodePort}/${ctlName}/${actionName}`;
  }
  //#endregion lcdp 接口区域结束

  /**
   * 根据控制器名称和路由名称获取产品管理完整的操作接口Url地址
   * @param ctrlName 控制器名称
   * @param actionName 方法名称
   * @param localField 该端口对应的控制本地调试的字段
   */
  GetApiOperateUrl(type: number, ctrlName: string, actionName: string): string {
    return (
      `http://${this.config.System?.ApiServerIp}:${type}` +
      this.getPrefixSnippet(type) +
      ctrlName +
      '/' +
      actionName
    );
  }

  /** 根据端口类型获取前缀Url片段
   * @param type:端口类型或者端口号
   * @param config:程序配置；
   * @param localField 该端口对应的控制本地调试的字段
   */
  protected getPrefixSnippet(port: number) {
    if (!port) {
      throw new Error('接口未配置端口号，请检查后重试！');
    }
    const portStr = port.toString();
    switch (portStr) {
      // case '8288':
      // case '8282':
      // case '3004':
      //   return '/';
      case `${this.appConfigSer.appConfig?.Project?.WebServerPort}` || '5200':
        return '/OldApi/';
      default:
        // return RH_CSHARP_PREFIX;
        return '/';
    }
  }

  //#region 通用handler区域
  /**
   * 所有的http调用都需要走这个方法
   * @param interfaceDto 通用接口模型
   * @param paraOrBody 参数或者body
   * @param option 请求选项
   * @param mock 是否启用mock
   * @returns
   */
  httpHandler(
    interfaceDto: RhInterfaceLocationDto,
    paraOrBody?: RhSafeAny,
    option?: XHttpOptions,
    mock = false
  ): Observable<DataResultT<RhSafeAny>> {
    try {
      if (!interfaceDto) {
        throw new Error('接口未配置，请检查后重试！');
      }
      mock = mock || this.getMockStatus(interfaceDto?.port as number);
      if (mock !== true) {
        return from(this.httpHandlerPromise(interfaceDto, paraOrBody, option));
      } else {
        return this.httpHandlerMock(interfaceDto, paraOrBody, option);
      }
    } catch (error: RhSafeAny) {
      MsgHelper.ShowErrorModal(error?.message);
      return of(DataResultT.fail('接口未配置，请检查后重试！'));
    }
  }

  /**
   * 通用的http请求处理方法(Promise)
   * @param interfaceDto 接口信息
   * @param paraOrBody 输入参数
   * @param option 请求配置
   * @param enableMock 是否启用Mock
   * @returns
   */
  private async httpHandlerPromise(
    interfaceDto: RhInterfaceLocationDto,
    paraOrBody?: Record<string, RhSafeAny>,
    option?: XHttpOptions
  ): Promise<DataResultT<RhSafeAny>> {
    try {
      const debug = this.appConfigSer?.appConfig?.Debug;
      const enableIntercept =
        debug?.DeveloperMode && debug.InterfaceIntercept?.EnableIntercept;
      if (
        this.appConfigSer.appConfig?.System?.EnableLcdpService !== false &&
        interfaceDto?.ModuleName
      ) {
        // 修正接口使用ip的优先级: 调试IP> interfaceDto.url > IsUserSiteServerIp>interfaceDto.ModuleName>interfaceDto.ServerIp>appConfig.ServerIp
        // 当启用了`IsUserSiteServerIp`，则会在`startup-service`中使用当前浏览器网址(hostName)替换`this.config.ServerIp`，最终达到使用浏览器地址栏host的目的
        const moduleDto = await this.getModuleConfigInfo(
          interfaceDto.ModuleName
        );
        interfaceDto.ServerIp =
          this.config?.System.IsUserSiteServerIp == true
            ? this.config?.System.ApiServerIp || ''
            : moduleDto?.ServerIp || interfaceDto.ServerIp;
        interfaceDto.port = moduleDto?.Port || interfaceDto.port;
        interfaceDto.GlobalPrefix =
          moduleDto?.GlobalPrefix || interfaceDto.GlobalPrefix;
      }
      if (interfaceDto?.url?.trim()) {
        return firstValueFrom(
          this.httpUrlHandler(
            interfaceDto.interfaceType || 'GET',
            interfaceDto.url.trim(),
            paraOrBody,
            option
          )
        );
      }
      // 使用调试配置的ip作为请求ip
      if (enableIntercept) {
        const portList = StringHelper.CommaNumHandler(
          debug?.InterfaceIntercept?.PortListStr
        );
        const interceptServer = debug.InterfaceIntercept?.InterceptServerIp;
        if (!portList?.length || !interceptServer?.trim()) {
          warn('调试接口或ip未配置，请检查后重试！');
        }
        let isInterceptActive = false;
        switch (debug?.InterfaceIntercept?.InterceptMode) {
          case 'port':
            if (
              portList.includes(
                Number.parseInt(interfaceDto?.port?.toString() as RhSafeAny)
              )
            ) {
              isInterceptActive = true;
            }
            break;
          case 'regex':
            if (
              debug?.InterfaceIntercept?.Regex &&
              new RegExp(debug.InterfaceIntercept.Regex).test(
                `/${interfaceDto?.controllerName}/${interfaceDto?.interfaceName}`
              )
            ) {
              isInterceptActive = true;
            }
            break;
          case 'all':
            isInterceptActive = true;
            break;
          default:
            isInterceptActive = false;
            break;
        }
        if (isInterceptActive) {
          console.info(
            `已启用本地调试，原请求IP：${interfaceDto.ServerIp},实际使用IP:${interceptServer}`
          );
          interfaceDto.ServerIp = interceptServer || '127.0.0.1';
        }
      }
      if (interfaceDto?.interfaceType?.toLowerCase() === 'post') {
        return firstValueFrom(
          this.postHandler(interfaceDto, paraOrBody, option)
        );
      } else {
        return firstValueFrom(
          this.getHandler(interfaceDto, paraOrBody, option)
        );
      }
    } catch (error) {
      MsgHelper.ShowErrorMessage(`接口请求发生错误:${error}`);
      throw new Error(`接口请求发生错误:${error}`);
    }
  }

  /** 模拟数据的http通用方法 */
  private httpHandlerMock(
    interfaceDto: RhInterfaceLocationDto,
    paraOrBody: Record<string, RhSafeAny>,
    option?: XHttpOptions
  ) {
    const mockServerIp = this.config?.Debug?.Mock?.MockServerIp;
    const mockInterfaceDto = { ...interfaceDto };
    mockInterfaceDto.ServerIp = mockServerIp;
    return mockInterfaceDto.interfaceType === 'POST'
      ? this.postHandler(mockInterfaceDto, paraOrBody, option)
      : this.getHandler(mockInterfaceDto, paraOrBody, option);
  }

  protected postHandler(
    interfaceDto: RhInterfaceLocationDto,
    body?: RhSafeAny,
    option?: XHttpOptions
  ): Observable<DataResultT<RhSafeAny>> {
    if (body === null || body === undefined) {
      body = {};
    }
    const url = this.getUrl(interfaceDto);
    return this.post(url, body, option);
  }

  /**
   * 通用get接口
   * @param interfaceDto 接口信息
   * @param para
   * @param option
   * @param enableMock
   */
  protected getHandler(
    interfaceDto: RhInterfaceLocationDto,
    para?: RhSafeAny,
    option?: XHttpOptions
  ): Observable<DataResultT<RhSafeAny>> {
    const url = this.getUrl(interfaceDto);
    if (para && typeof para === 'object') {
      return this.get(url, { params: { ...para }, ...option });
    } else {
      return this.get(url, option);
    }
  }

  /**
   * 使用完整的接口网址发起请求
   * @param httpType 请求类型
   * @param url 请求接口地址
   * @param body
   * @param options
   * @returns
   */
  httpUrlHandler<T>(
    httpType: WithNil<XHttpMethod>,
    url: string,
    body: RhSafeAny,
    options?: XHttpOptions
  ) {
    url = this.urlParse(url);
    switch (httpType) {
      case 'POST':
        return this.post<T>(url, body, options);
      case 'GET':
        return this.get<T>(url, options);
      default:
        throw new Error(`没有定义的httpType：${httpType}`);
    }
  }

  /**
   * 处理url中的`${host}`/`${port}`等占位符
   * @param url 处理前的url
   * @returns 处理后的url
   * @description {host} {port}表示浏览器地址栏的host和port;{apiHost} {apiPort}表示后端api的host和port;
   *  {nodeHost} {nodePort}表示node服务的host和port
   */
  urlParse(url: string): string {
    const host: string = window.location.hostname;
    const port: string = window.location.port;
    const apiHost: string = this.config?.System?.ApiServerIp;
    const apiPort = this.config?.System?.ApiPort;

    const nodeHost = this.config?.System?.NodeServerIp;
    const nodePort = this.config?.System.NodePort;

    const pattern = /\${\w*}/g;
    const result = url.replace(pattern, (str) => {
      if (str === '${host}') {
        return host;
      }
      if (str === '${port}') {
        return port;
      }
      if (str === '${apiHost}') {
        return apiHost;
      }
      if (str === '${apiPort}') {
        return apiPort.toString();
      }
      if (str === '${nodeHost}') {
        return nodeHost;
      }
      if (str === '${nodePort}') {
        return nodePort.toString();
      }
      return str;
    });

    return result;
  }

  get<T>(url: string, options?: XHttpOptions): Observable<RhSafeAny> {
    // FIXME:
    return this.http.get<T>(url, { withCredentials: true, ...(options || {}) });
  }

  post<T>(
    url: string,
    body: RhSafeAny,
    options?: XHttpOptions
  ): Observable<RhSafeAny> {
    //
    return this.http.post<T>(url, body, {
      withCredentials: true,
      ...(options || {}),
    });
  }

  getUrl(interfaceDto: RhInterfaceLocationDto): string {
    if (interfaceDto?.url?.trim()) {
      return interfaceDto?.url?.trim();
    }
    let serverIp = interfaceDto.ServerIp as string;
    // 如果是nestjs相关的端口号使用`NodeServerIp`，否则使用`ServerIp`
    if (!serverIp) {
      if ([3001, 3002, 3003, 3004].includes(interfaceDto.port as number)) {
        serverIp = this.config?.System?.NodeServerIp;
        // 添加默认前缀
        !interfaceDto?.GlobalPrefix
          ? (interfaceDto.GlobalPrefix = this.getPrefixSnippet(
              interfaceDto.port as number
            ))
          : noop();
      } else {
        serverIp = this.config?.System?.ApiServerIp as string;
        // 添加默认前缀
        !interfaceDto?.GlobalPrefix
          ? (interfaceDto.GlobalPrefix = this.getPrefixSnippet(
              interfaceDto.port as number
            ))
          : noop();
      }
    }
    if (!serverIp) {
      throw new Error(
        `接口${interfaceDto?.interfaceName}请求服务器地址未配置！`
      );
    }
    const port = (interfaceDto.port as number) || this.config.System.NodePort;
    if (!port) {
      throw new Error(`接口${interfaceDto.interfaceName}请求端口未配置`);
    }

    // 处理globalPrefix前后的非法`/`
    let globalPrefix = `/${(interfaceDto.GlobalPrefix || '')
      .split('/')
      .filter((ele: string) => ele)
      .join('/')}`;
    if (globalPrefix === '/') {
      globalPrefix = '';
    }
    const controller = interfaceDto.controllerName as string;
    // 添加是否本地调试判断
    const url = `http://${serverIp}:${port}${globalPrefix}/${controller}/${
      interfaceDto.interfaceName as string
    }`;
    return url;
  }

  //#endregion 通用handler区域结束

  isInterfaceLocationDto(data: RhSafeAny): data is RhInterfaceLocationDto {
    return !!(
      // (data as RhInterfaceLocationDto)?.port &&
      (
        ((data as RhInterfaceLocationDto)?.controllerName &&
          (data as RhInterfaceLocationDto)?.interfaceName) ||
        (data as RhInterfaceLocationDto)?.ModuleName ||
        (data as RhInterfaceLocationDto)?.url
      )
    );
  }

  protected printLogInfo(url: string, dto: RhSafeAny) {
    // eslint-disable-next-line no-console
    console.log(`
      url:${url},
      input:${dto ? JSON.stringify(dto) : null}
      `);
  }

  /**
   * 根据模块名称获取模块详细信息
   * @param moduleName 模块名称
   * @returns 模块详细信息
   */
  protected async getModuleConfigInfo(moduleName: string) {
    if (!moduleName) {
      throw new Error('传入空的模块名称');
    }
    if (this._lcdpModuleConfigDataSet[moduleName]) {
      return this._lcdpModuleConfigDataSet[moduleName];
    } else {
      const queryDto: Pick<RhDevModuleConfigDto, 'ModuleName'> = {
        ModuleName: moduleName,
      };
      const moduleConfig$ = firstValueFrom(
        this.postLcdp<
          Pick<RhDevModuleConfigDto, 'ModuleName'>,
          DataResultT<RhDevModuleConfigDto[]>
        >('DevModuleConfig', 'getModuleConfigDatas', queryDto).pipe(
          tap((result) => {
            if (result.Attach?.length > 1) {
              // eslint-disable-next-line no-console
              console.error(
                `查找模块${moduleName}时出现多条匹配记录，请检查模块配置！`
              );
              throw new Error(
                `查找模块${moduleName}出现多条匹配记录，请检查模块配置！`
              );
            }
            const config = result.Attach?.[0];
            if (config?.ModuleName === LCDP_MODULE_NAME) {
              config.ServerIp = this.appConfigSer.appConfig.System.NodeServerIp;
            }
            if (!config) {
              // eslint-disable-next-line no-console
              console.warn(`查找模块${moduleName}时，搜索数据为空！`);
              // throw new Error(`查找模块${moduleName}发生错误，请检查模块配置！`);
            } else {
              this._lcdpModuleConfigDataSet[moduleName] = config;
            }
          }),
          map((result) => result.Attach?.[0] || null)
        )
      );
      return moduleConfig$;
    }
  }

  /**
   * 接口对象处理
   * @description 针对通用接口，需要根据`ModuleName`获取对应的`ip`/`port`/`globalPrefix`信息
   * @param interfaceDto 未经处理的接口对象
   */
  async urlHandler(interfaceDto: RhInterfaceLocationDto): Promise<string> {
    if (interfaceDto?.ModuleName) {
      const tempDevModuleDto = await this.getModuleConfigInfo(
        interfaceDto.ModuleName
      );
      interfaceDto.ServerIp = tempDevModuleDto.ServerIp;
      interfaceDto.GlobalPrefix = tempDevModuleDto.GlobalPrefix;
      interfaceDto.port = tempDevModuleDto.Port;
      return this.getUrl(interfaceDto);
    } else {
      return this.getUrl(interfaceDto);
    }
  }

  protected getMockStatus(port: number) {
    const mockConfig = this.appConfigSer?.appConfig?.Debug?.Mock;
    return (
      mockConfig?.EnableMock ||
      (StringHelper.CommaNumHandler(mockConfig?.MockListStr) || []).includes(
        port
      )
    );
  }
}
