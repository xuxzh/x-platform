import { NgModule } from '@angular/core';
import { ApiConfigService } from './service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [ApiConfigService],
})
export class CoreModule {}
