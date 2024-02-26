import { Injectable } from '@angular/core';
import { ApiConfigService } from '@core';
import { LoginDto, InterfaceDto, IToken } from '@model';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private apiConfigSer: ApiConfigService) {
    //
  }

  login(value: LoginDto): Observable<IToken> {
    const loginInterface: InterfaceDto = {
      controller: 'auth',
      interfaceName: 'login',
    };
    return this.apiConfigSer.post(loginInterface, value);
  }
}
