/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { RhSafeAny } from '@x/base/model';

@Injectable({
  providedIn: 'root',
})
export class RhLoggerService {
  // constructor() {
  //   //
  // }

  /**
   * 在控制台输出http请求信息
   * @param url 请求网址
   * @param input 输入参数
   */
  logHttpInfo(url: string, input?: RhSafeAny) {
    this.log(`url:${url}`);
    this.log('inputDto:');
    if (input) {
      this.log(JSON.stringify(input));
    }
  }

  log(info: string) {
    console.log(info);
  }

  warn(info: string) {
    console.warn(info);
  }

  error(info: string) {
    console.log(info);
  }

  debug(info: string) {
    // if(this.a) 读取当前的window.RUIHUI配置
  }
}
