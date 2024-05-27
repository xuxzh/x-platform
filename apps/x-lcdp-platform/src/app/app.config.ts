import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  Provider,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { XInteractionService } from '@x/base/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

function interactionFactory(interactionSer: XInteractionService) {
  return () => {
    interactionSer.initInteractionConfig();
  };
}

const appInitProviders: Provider[] = [
  XInteractionService,
  NzMessageService,
  NzModalService,
  NzNotificationService,
  {
    provide: APP_INITIALIZER,
    useFactory: interactionFactory,
    deps: [XInteractionService],
    multi: true,
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...appInitProviders,
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
  ],
};
