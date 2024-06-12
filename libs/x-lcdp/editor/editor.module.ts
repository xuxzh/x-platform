import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { X_MONACO_EDITOR_CONFIG, XMonacoEditorConfig } from './config';
import { XDiffEditorComponent } from './diff-editor.component';
import { XEditorComponent } from './editor.component';

@NgModule({
  imports: [CommonModule, XEditorComponent, XDiffEditorComponent],
  exports: [XEditorComponent, XDiffEditorComponent],
})
export class XMonacoEditorModule {
  public static forRoot(
    config: XMonacoEditorConfig = {}
  ): ModuleWithProviders<XMonacoEditorModule> {
    return {
      ngModule: XMonacoEditorModule,
      providers: [{ provide: X_MONACO_EDITOR_CONFIG, useValue: config }],
    };
  }
}
