import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { XMonacoEditorModule, XEditorComponent } from '@x/lcdp/editor';
import { Subscription, debounceTime, filter } from 'rxjs';
import { FunctionHelper, MsgHelper, ObjectHelper } from '@x/base/core';
import { IPageSchema, INodeSchema } from '@x/lcdp/model';
import { XSchemaDataBase } from '../desktop/base';
import { XJsonSchemaHelper } from '@x/lcdp/core';
import { XJsonDesignerService } from '@x/lcdp/designer';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'xp-designer-schema',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    XMonacoEditorModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './designer-schema.component.html',
  styleUrl: './designer-schema.component.less',
})
export class DesignerSchemaComponent extends XSchemaDataBase implements OnInit {
  /** 点击保存按钮 */
  @Output() rhSave = new EventEmitter();
  /** 点击关闭按钮 */
  @Output() rhClose = new EventEmitter();
  /** 点击重置按钮
   * @description 会将代码重置为上一次保存的状态
   */
  @Output() rhReset = new EventEmitter();

  @ViewChild(XEditorComponent) editorComp!: XEditorComponent;
  editorOptions = { theme: 'vs-dark', language: 'json', formatOnType: false };

  buttonVisible = false;

  resizeSubscription!: Subscription;

  jsonSchemaDataBackup!: INodeSchema;

  /** 代码编辑器上的文本值 */
  editorValue = '';

  /** 代码是否已保存 */
  isSaved = true;
  fistChange = true;

  cancelFirstChangeDebounce = FunctionHelper.debounce(
    () => this.cancelFirstChange(),
    50
  );

  cdr = inject(ChangeDetectorRef);

  jsonDesignerSer = inject(XJsonDesignerService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.buttonVisible = true;
    // }, 300);
    MsgHelper.ShowGlobalLoadingMessage('编辑器加载中，请稍候...', 500);
    this.editorValue = JSON.stringify(
      this.jsonSchemaSer.rootJsonSchemaDataset,
      null,
      2
    );
    this.resizeSubscription = this.jsonDesignerSer.designerResize$.subscribe(
      () => {
        this.editorComp?.refreshLayout();
      }
    );
  }

  override subscribeJsonSchemaData() {
    if (this.jsonSchemaSer.isRuntime) {
      return;
    }
    try {
      this.editorValue = JSON.stringify(
        this.jsonSchemaSer.rootJsonSchemaDataset,
        null,
        2
      );
    } catch (error) {
      throw new Error('JSON Schema转换失败:' + error);
    }
    this.jsonSchemaSubscription = this.jsonSchemaSer.jsonSchemaDataset$
      .pipe(
        filter(() => this.jsonSchemaSer.jsonSchemaOperationType !== 'select'),
        debounceTime(100)
      )
      .subscribe((data) => {
        // this.jsonSchemaData = data as RhComponentSchemaDto;
        this.editorValue = XJsonSchemaHelper.jsonSchemaDataStringifyHandler(
          data,
          2
        );
        this.jsonSchemaDataBackup = ObjectHelper.cloneDeep(data);
        this.cdr.markForCheck();
      });
  }

  // onDidCreateEditor() {
  //   this.buttonVisible = true;
  // }

  onCodeChange() {
    this.cancelFirstChangeDebounce();
    if (!this.fistChange) {
      this.handleSaveStatusAndDocumentTitle(false);
    }
  }

  saveCode() {
    let tempJsonSchemaData: IPageSchema;
    if (!this.editorValue) {
      MsgHelper.ShowInfoMessage('没有需要保存的内容');
      return;
    }
    try {
      tempJsonSchemaData = JSON.parse(this.editorValue);
      Object.assign(
        this.jsonSchemaSer.rootJsonSchemaDataset,
        tempJsonSchemaData
      ); //没有去覆盖掉原来那份json，如果直接覆盖了，会导致子模块对宿主host的引用丢失
      this.jsonSchemaSer.refreshSchemaData(
        'init',
        this.jsonSchemaSer.rootJsonSchemaDataset
      );
      MsgHelper.ShowSuccessMessage('配置数据已保存');
      this.rhSave.emit();
      setTimeout(() => {
        this.handleSaveStatusAndDocumentTitle(true);
      }, 200);
    } catch (error) {
      MsgHelper.ShowErrorMessage(`JSON格式错误，请检查后重试:${error}`);
    }
  }

  resetCode() {
    this.editorValue = JSON.stringify(this.jsonSchemaDataBackup, null, 2);
    this.rhReset.emit();
  }

  closePage() {
    if (!this.saveCode) {
      MsgHelper.ShowConfirmModal(
        `配置未保存`,
        '配置未保存，继续切换将丢失修改的配置信息，是否继续？',
        () => {
          this.rhClose.emit();
        }
      );
    } else {
      this.rhClose.emit();
    }
  }

  cancelFirstChange() {
    if (this.fistChange) {
      this.fistChange = false;
      return false;
    }
    return true;
  }

  onContentSizeChange() {
    this.buttonVisible = true;
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
  }

  private handleSaveStatusAndDocumentTitle(status: boolean) {
    if (status) {
      this.isSaved = true;
      if (document.title.endsWith('*')) {
        document.title = document.title.slice(0, -1);
      }
    } else {
      this.isSaved = false;
      if (!document.title.endsWith('*')) {
        document.title = `${document.title}*`;
      }
    }
  }
}
