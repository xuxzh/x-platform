import {
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RhSafeAny } from '@x/base/model';
import { fromEvent } from 'rxjs';

import { BaseEditorComponent } from './base-editor';
import { X_MONACO_EDITOR_CONFIG, XMonacoEditorConfig } from './config';
import { RhEditorModel } from './types';
import { CommonModule } from '@angular/common';
import { provideValueAccessor } from '@x/base/core';

declare const monaco: RhSafeAny;

@Component({
  selector: 'x-monaco-editor',
  template: '<div class="editor-container" #editorContainer></div>',
  styles: [
    `
      .editor-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  providers: [provideValueAccessor(XEditorComponent)],
  standalone: true,
  imports: [CommonModule],
})
export class XEditorComponent
  extends BaseEditorComponent
  implements ControlValueAccessor
{
  private _value = '';

  propagateChange = (_: RhSafeAny) => {
    //
  };
  onTouched = () => {
    //
  };

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
  set model(model: RhEditorModel) {
    this.options.model = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options);
    }
  }

  @Output()
  xDidContentSizeChange = new EventEmitter();

  @Output()
  xDidDispose = new EventEmitter();

  constructor(
    private zone: NgZone,
    @Inject(X_MONACO_EDITOR_CONFIG) editorConfig: XMonacoEditorConfig
  ) {
    super(editorConfig);
  }

  writeValue(value: RhSafeAny): void {
    this._value = value || '';
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this._editor && !this.options.model) {
        this._editor.setValue(this._value);
      }
    });
  }

  registerOnChange(fn: RhSafeAny): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: RhSafeAny): void {
    this.onTouched = fn;
  }

  protected initMonaco(options: RhSafeAny): void {
    const hasModel = !!options.model;

    if (hasModel) {
      const model = monaco.editor.getModel(options.model.uri || '');
      if (model) {
        options.model = model;
        options.model.setValue(this._value);
      } else {
        options.model = monaco.editor.createModel(
          options.model.value,
          options.model.language,
          options.model.uri
        );
      }
    }

    this._editor = monaco.editor.create(
      this._editorContainer.nativeElement,
      options
    );

    if (!hasModel) {
      this._editor.setValue(this._value);
    }

    this._editor.onDidChangeModelContent((e: RhSafeAny) => {
      const value = this._editor.getValue();

      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => {
        this.propagateChange(value);
        this._value = value;
      });
    });

    this._editor.onDidBlurEditorWidget(() => {
      this.onTouched();
    });

    this._editor.onDidContentSizeChange(() => {
      this.xDidContentSizeChange.emit();
    });

    this._editor.onDidDispose(() => {
      this.xDidDispose.emit();
    });

    // this._editor.onDidLayoutChange(() => {
    //   console.log('aaa');
    // });

    // monaco.editor.onDidCreateEditor(() => {
    //   console.log('hello world!!!');
    // });

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
