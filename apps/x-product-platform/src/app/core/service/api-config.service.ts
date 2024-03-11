import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterfaceDto, RhSafeAny } from '@model';
import { Observable } from 'rxjs';

@Injectable()
export class ApiConfigService {
  globalPrefix = 'api';

  constructor(private http: HttpClient) {}

  post(
    interfaceDto: InterfaceDto,
    body: Record<string, RhSafeAny>
  ): Observable<RhSafeAny> {
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

  put(
    interfaceDto: InterfaceDto,
    body: Record<string, RhSafeAny>
  ): Observable<RhSafeAny> {
    return this.http.put(
      `/${this.globalPrefix}/${interfaceDto.controller}/${interfaceDto.interfaceName}`,
      body
    );
  }

  delete(
    interfaceDto: InterfaceDto,
    body: { Id: number }
  ): Observable<RhSafeAny> {
    return this.http.delete(
      `/${this.globalPrefix}/${interfaceDto.controller}/${interfaceDto.interfaceName}/${body.Id}`
    );
  }
}
