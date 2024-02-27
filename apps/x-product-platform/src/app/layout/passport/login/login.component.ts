import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LoginDto, RhSafeAny } from '@model';
import { AuthService, CoreModule } from '@core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  providers: [LoginService],
})
export class LoginComponent {
  loginForm: FormGroup;
  pwdIcon = 'visibility_off';
  pwdInputType = 'password';
  operator = inject(LoginService);
  authSer = inject(AuthService);
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      UserCode: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    });
  }

  login(value: LoginDto) {
    this.operator.login(value).subscribe((result) => {
      if (result.accessToken && result.refreshToken) {
        // 存储token信息
        this.authSer.accessToken.set(result.accessToken);
        this.authSer.refreshToken.set(result.refreshToken);
        this.router.navigate(['/main/home']).catch((error: RhSafeAny) => {
          console.error(
            `跳转到主页发生错误:${error?.message ? error.message : ''}`
          );
        });
      }
    });
  }

  changePwdInput() {
    if (this.pwdIcon === 'visibility_off') {
      this.pwdInputType = 'text';
      this.pwdIcon = 'visibility';
    } else {
      this.pwdInputType = 'password';
      this.pwdIcon = 'visibility_off';
    }
  }
}
