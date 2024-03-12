import { NgModule } from '@angular/core';
import { ApiConfigService } from './service';
import { HttpClientModule } from '@angular/common/http';
import { MsgHelperService } from './utils';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ErrorHandlerInterceptor } from './interceptor';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  imports: [
    HttpClientModule,
    NzModalModule,
    NzMessageModule,
    NzNotificationModule,
  ],
  providers: [ApiConfigService, MsgHelperService, ErrorHandlerInterceptor],
})
export class CoreModule {}
