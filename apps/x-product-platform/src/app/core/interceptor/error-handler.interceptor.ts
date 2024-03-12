import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RhSafeAny } from '@model';
import { Injectable, inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  notificationSer = inject(NzNotificationService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<RhSafeAny>> {
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse && event.status === 200) {
            //
          }
        },
        error: (error) => {
          const statusCode = error.status;
          const msg = error?.error?.message;
          if (statusCode === 0 || statusCode >= 400) {
            switch (statusCode) {
              case 0:
                break;
              case 400:
                this.noticeErrorMsg(`客户端异常:${msg}`, statusCode);
                break;
              case 500:
                this.noticeErrorMsg(`服务器异常:${msg}`, statusCode);
                break;
              default:
                this.noticeErrorMsg(`未知异常:${msg}`, statusCode);
                break;
            }
          }
        },
      })
    );
  }

  protected noticeErrorMsg(
    msg: string,
    statusCode: number,
    duration = 5000,
    width?: number
  ): void {
    this.notificationSer.error('错误代码：' + statusCode, msg, {
      nzDuration: duration,
      nzPauseOnHover: true,
      nzPlacement: 'bottomRight',
      nzStyle: {
        nzMaxStack: 3,
        width: width ? `${width}px` : '420px',
        // marginLeft: '-50vw',
      },
    });
  }
}
