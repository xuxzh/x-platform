import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RhAppConfigService } from './app-config.service';
import { RhApiConfigBase } from './api-config.base';
import {
  DataResultT,
  RhInterfaceLocationDto,
  RhSafeAny,
  XHttpOptions,
} from '@x/base/model';
import { Observable } from 'rxjs';
import { RhLoggerService } from '../logger';

@Injectable({
  providedIn: 'root',
})
export class RhApiConfigService extends RhApiConfigBase {
  constructor(
    public override http: HttpClient,
    public override appConfigSer: RhAppConfigService,
    public override logger: RhLoggerService
  ) {
    super(http, appConfigSer, logger);
    this.isLoggerOn = (this.config && this.config?.Logger?.IsLoggerOn) || false;
  }

  //#region MES API区域区域
  /**
   * 通用nest接口post调用
   */
  postMes<InputT>(
    controllerName: string,
    interfaceName: string,
    dto?: InputT,
    options?: XHttpOptions,
    mock = false
  ): Observable<DataResultT<RhSafeAny> | RhSafeAny> {
    // const url = this.getMesApi(controllerName, interfaceName);
    // if (this.isLoggerOn) {
    //   this.printLogInfo(url, dto);
    // }
    // return this.http.post<OutT>(url, dto, options);
    mock = mock || this.getMockStatus(8288);
    const interfaceDto: RhInterfaceLocationDto = {
      interfaceType: 'POST',
      port: 8288,
      controllerName,
      interfaceName,
    };
    return this.httpHandler(interfaceDto, dto, options, mock);
  }

  /**
   * 通用nest接口get调用
   */
  getMes<OutT>(
    controllerName: string,
    interfaceName: string,
    options?: XHttpOptions
  ) {
    const url = this.getMesApi(controllerName, interfaceName);
    return this.http.get<OutT>(url, options);
  }

  private getMesApi(controllerName: string, interfaceName: string) {
    if (!this.config?.System?.ApiServerIp || !this.config?.System?.ApiPort) {
      throw new Error('MES服务或端口未配置，请检查后重试！');
    }
    return `http://${this.config.System.ApiServerIp}:${this.config.System.ApiPort}/${controllerName}/${interfaceName}`;
  }
  //#endregion MES API区域区域结束
}
