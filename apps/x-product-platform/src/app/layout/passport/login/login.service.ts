import { Injectable } from '@angular/core';
import { ApiConfigService } from '@core';
import { LoginDto, InterfaceDto, IToken, IResponseDto } from '@model';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private apiConfigSer: ApiConfigService) {
    //
  }

  login(value: LoginDto): Observable<IResponseDto<IToken>> {
    const loginInterface: InterfaceDto = {
      controller: 'auth',
      interfaceName: 'login',
    };
    return this.apiConfigSer.post(loginInterface, value);
  }
}
