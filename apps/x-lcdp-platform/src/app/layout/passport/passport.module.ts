import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { LockComponent } from './lock/lock.component';
import { RegisterComponent } from './register/register.component';
import { RegisterResultComponent } from './register-result/register-result.component';

const comps = [
  LockComponent,
  LoginComponent,
  RegisterComponent,
  RegisterResultComponent,
];

@NgModule({
  imports: [...comps],
  exports: [...comps],
})
export class PassportModule {}
