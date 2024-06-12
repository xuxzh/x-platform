import { Component, Inject, Input } from '@angular/core';
import { RhSafeAny } from '@x/base/model';
import { fromEvent } from 'rxjs';

import { BaseEditorComponent } from './base-editor';
import { X_MONACO_EDITOR_CONFIG, XMonacoEditorConfig } from './config';
import { RhDiffEditorModel } from './types';
import { CommonModule } from '@angular/common';

declare const monaco: RhSafeAny;

@Component({
  selector: 'x-monaco-diff-editor',
  template: '<div class="editor-container" #editorContainer></div>',
  styles: [
    `
      :host {
        display: block;
        height: 200px;
      }

      .editor-container {
        width: 100%;
        height: 98%;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class XDiffEditorComponent extends BaseEditorComponent {
  _originalModel!: RhDiffEditorModel;
  _modifiedModel!: RhDiffEditorModel;

  @Input()
  set options(options: RhSafeAny) {
    this._options = Object.assign({}, this.config.defaultOptions, options);
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(options);
    }
  }

  get options(): RhSafeAny {
    return this._options;
  }

  @Input()
  set originalModel(model: RhDiffEditorModel) {
    this._originalModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options);
    }
  }

  @Input()
  set modifiedModel(model: RhDiffEditorModel) {
    this._modifiedModel = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options);
    }
  }

  constructor(
    @Inject(X_MONACO_EDITOR_CONFIG) private editorConfig: XMonacoEditorConfig
  ) {
    super(editorConfig);
  }

  protected initMonaco(options: RhSafeAny): void {
    if (!this._originalModel || !this._modifiedModel) {
      throw new Error(
        'originalModel or modifiedModel not found for ngx-monaco-diff-editor'
      );
    }

    this._originalModel.language =
      this._originalModel.language || options.language;
    this._modifiedModel.language =
      this._modifiedModel.language || options.language;

    const originalModel = monaco.editor.createModel(
      this._originalModel.code,
      this._originalModel.language
    );
    const modifiedModel = monaco.editor.createModel(
      this._modifiedModel.code,
      this._modifiedModel.language
    );

    this._editorContainer.nativeElement.innerHTML = '';
    const theme = options.theme;
    this._editor = monaco.editor.createDiffEditor(
      this._editorContainer.nativeElement,
      options
    );
    options.theme = theme;
    this._editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() =>
      this._editor.layout()
    );
    this.xInit.emit(this._editor);
  }
}
