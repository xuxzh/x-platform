import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterfaceDto } from '@model';
import { Observable } from 'rxjs';

@Injectable()
export class ApiConfigService {
  globalPrefix = 'api';

  constructor(private http: HttpClient) {}

  post(interfaceDto: InterfaceDto, body: Record<string, any>): Observable<any> {
    return this.http.post(
      `/${this.globalPrefix}/${interfaceDto.controller}/${interfaceDto.interfaceName}`,
      body
    );
  }
  get(interfaceDto: InterfaceDto, params: Record<string, string> = {}) {
    return this.http.get(
      `/${this.globalPrefix}/${interfaceDto.controller}/${interfaceDto.interfaceName}`,
      {
        params,
      }
    );
  }
}
