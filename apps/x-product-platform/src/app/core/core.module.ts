import { NgModule } from '@angular/core';
import { ApiConfigService } from './service';
import { HttpClientModule } from '@angular/common/http';
import { MsgHelperService } from './utils';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  imports: [HttpClientModule, NzModalModule, NzMessageModule],
  providers: [ApiConfigService, MsgHelperService],
})
export class CoreModule {}
