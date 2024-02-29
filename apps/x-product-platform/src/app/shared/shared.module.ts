import { NgModule } from '@angular/core';
import { RhSafeAny } from '@model';

const modules: RhSafeAny[] = [];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class SharedModule {}
