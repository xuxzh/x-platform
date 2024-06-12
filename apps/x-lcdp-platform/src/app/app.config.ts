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
import { RhSafeAny } from '@x/base/model';

import {
  XMonacoEditorModule,
  XMonacoEditorConfig,
  X_MONACO_EDITOR_CONFIG,
} from '@x/lcdp/editor';
import {
  xDesignerLibDeclaration,
  xEditorLibDeclaration,
} from '@x/lcdp/designer';
declare const monaco: RhSafeAny;

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

const monacoConfig: XMonacoEditorConfig = {
  defaultOptions: { scrollBeyondLastLine: false },
  onMonacoLoad: () => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
    });
    const lib = xDesignerLibDeclaration;
    const libUri = 'ts:filename/rh-interaction.d.ts';
    const lib2 = xEditorLibDeclaration;
    const libUri2 = 'ts:filename/rh-formLib.d.ts';
    monaco.languages.typescript.javascriptDefaults.addExtraLib(lib, libUri);
    monaco.languages.typescript.javascriptDefaults.addExtraLib(lib2, libUri2);
    // When resolving definitions and references, the editor will try to use created models.
    // Creating a model for the library allows "peek definition/references" commands to work with the library.
    monaco.editor.createModel(lib, 'typescript', monaco.Uri.parse(libUri));
    monaco.editor.createModel(lib2, 'typescript', monaco.Uri.parse(libUri2));
    // const lib = RH_DECLARRATION;
    // const libUri = 'ts:filename/rh-declaration.d.ts';
    // monaco.languages.typescript.javascriptDefaults.addExtraLib(lib, libUri);
    // // When resolving definitions and references, the editor will try to use created models.
    // // Creating a model for the library allows "peek definition/references" commands to work with the library.
    // monaco.editor.createModel(lib, 'typescript', monaco.Uri.parse(libUri));
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    ...appInitProviders,
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    {
      provide: X_MONACO_EDITOR_CONFIG,
      useValue: monacoConfig,
    },
  ],
};
