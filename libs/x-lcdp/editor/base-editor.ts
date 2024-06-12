import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { RhSafeAny } from '@x/base/model';

import { X_MONACO_EDITOR_CONFIG, XMonacoEditorConfig } from './config';

let loadedMonaco = false;
let loadPromise: Promise<void>;

@Component({
  template: '',
})
export abstract class BaseEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) _editorContainer!: ElementRef;
  @Output() xInit = new EventEmitter<RhSafeAny>();
  protected _editor: RhSafeAny;
  protected _options: RhSafeAny;
  protected _windowResizeSubscription!: Subscription;

  constructor(
    @Inject(X_MONACO_EDITOR_CONFIG) protected config: XMonacoEditorConfig
  ) {}

  ngAfterViewInit(): void {
    if (loadedMonaco) {
      // Wait until monaco editor is available
      loadPromise.then(() => {
        this.initMonaco(this._options);
      });
    } else {
      loadedMonaco = true;
      loadPromise = new Promise<void>((resolve: RhSafeAny) => {
        const baseUrl =
          (this.config.baseUrl || './assets') + '/monaco-editor/min/vs';
        if (typeof (<RhSafeAny>window).monaco === 'object') {
          resolve();
          return;
        }
        const onGotAmdLoader: RhSafeAny = () => {
          // Load monaco
          (<RhSafeAny>window).require.config({ paths: { vs: `${baseUrl}` } });
          (<RhSafeAny>window).require([`vs/editor/editor.main`], () => {
            if (typeof this.config.onMonacoLoad === 'function') {
              this.config.onMonacoLoad();
            }
            this.initMonaco(this._options);
            resolve();
          });
        };

        // Load AMD loader if necessary
        if (!(<RhSafeAny>window).require) {
          const loaderScript: HTMLScriptElement =
            document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = `${baseUrl}/loader.js`;
          loaderScript.addEventListener('load', onGotAmdLoader);
          document.body.appendChild(loaderScript);
        } else {
          onGotAmdLoader();
        }
      });
    }
  }

  protected abstract initMonaco(options: RhSafeAny): void;

  ngOnDestroy() {
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    if (this._editor) {
      this._editor.dispose();
      this._editor = undefined;
    }
  }

  /** 刷新布局
   * @description 一般用于editor区域大小变动，且不是由`window.resize`触发的时候。
   */
  refreshLayout() {
    this._editor?.layout();
  }
}
