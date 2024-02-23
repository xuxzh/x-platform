import { NgModule } from '@angular/core';
import { Exception403Component } from './403.component';
import { Exception404Component } from './404.component';
import { Exception500Component } from './500.component';

const routes = [
  Exception403Component,
  Exception404Component,
  Exception500Component,
];

@NgModule({
  imports: [...routes],
  exports: [...routes],
})
export class ExceptionModule {}
