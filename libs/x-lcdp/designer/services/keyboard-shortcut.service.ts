import { Injectable } from '@angular/core';
import { RhSafeAny, WithNil } from '@x/base/model';
import { IComponentSchema } from '@x/lcdp/model';
import { XJsonDesignerService } from './json-designer.service';
import { XJsonSchemaService } from './json-schema.service';
import { guid } from '@x/base/core';

@Injectable()
export class XKeyboardShortcutService {
  private handlers: Record<string, RhSafeAny> = {
    c: () => this.handleCopy(),
    x: () => this.handleCut(),
    v: () => this.handlePaste(),
    delete: () => this.handleDelete(),
  };
  /** 当前操作中的节点 */
  private operatingNode: WithNil<IComponentSchema>;
  /** 操作类型 */
  private operationType: 'copy' | 'cut' | null = null;
  /** 操作类型名称 */
  private opNameMap = {
    copy: '复制',
    cut: '剪切',
    paste: '粘贴',
    delete: '删除',
  };

  // get designerNode() {
  //   return this.jsonDesignSer.designerNode;
  // }

  constructor(
    public jsonDesignSer: XJsonDesignerService,
    public jsonSchemaSer: XJsonSchemaService
  ) {}

  handleKeyEvent(ev: KeyboardEvent) {
    if (!ev.ctrlKey && ev.key != 'Delete') return;
    const key = ev.key.toLowerCase();
    if (this.handlers[key]) {
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      this.handlers[key]();
    }
  }

  handleCopy = () => {
    // if (this.designerNode && this.designerNode.type != 'page') {
    //   //console.log("复制", this.designerNode);
    //   this.operatingNode = this.designerNode;
    // }
  };

  handleCut = () => {
    // if (this.designerNode && this.designerNode.type != 'page') {
    //   //console.log("剪切", this.designerNode);
    //   this.operatingNode = this.designerNode;
    //   this.jsonDesignSer.removeSchemaData(this.operatingNode);
    //   this.jsonDesignSer.clearDesignerNode();
    //   this.operationType = 'cut';
    //   this.setHistory('paste', this.operatingNode.displayName);
    //   MsgHelper.ShowSuccessMessage('已剪切当前节点！');
    // }
  };

  handlePaste = () => {
    // if (!this.operatingNode) return;
    // const target = this.operatingNode;
    // const parent = this.designerNode;
    // const rootJson = this.jsonSchemaSer.rootJsonSchemaDataset;
    // if (!parent) return;
    // if (!['page', 'sub-page', 'container', 'void'].includes(parent.type))
    //   return MsgHelper.ShowErrorMessage(
    //     '节点只能粘贴到页面、子页面或者容器组件内部！'
    //   );
    // const content =
    //   this.operationType == 'copy'
    //     ? this.createNewNodeWithDifferentKey(target, parent.key)
    //     : target;
    // if (this.operationType == 'cut') {
    //   //如果是剪切，就是一次性操作
    //   this.operatingNode = null;
    //   this.operationType = null;
    // }
    // if (!content.children) content.children = [];
    // if (target.type == 'sub-page') {
    //   //操作的是个子页面的时候
    //   if (parent.type == 'page') {
    //     //检查，如果是粘贴到页面下，那么直接放进去就可以
    //     rootJson.subPages.push(content);
    //     XJsonMapData.autoAddDataFromJson([content]);
    //   } else {
    //     //但如果是放置到别的容器里，就把子页面的内容放置到目标容器里，注意，此时需要修改下内容的parent为容器key，而不是再指向子页面。
    //     parent.children.push(
    //       ...content.children.map((child) => {
    //         child.parent = parent.key;
    //         return child;
    //       })
    //     );
    //     XJsonMapData.autoAddDataFromJson(content.children);
    //   }
    // } else {
    //   //如果不是子页面，就直接将节点塞到到目标容器里。
    //   content.parent = parent.key;
    //   parent.children.push(content);
    //   XJsonMapData.autoAddDataFromJson([content]);
    // }
    // this.setHistory('paste', target.displayName); //写入历史
    // this.jsonSchemaSer.refreshSchemaData('refresh');
  };

  handleDelete = () => {
    // if (this.designerNode) {
    //   this.jsonDesignSer.deleteNode(this.designerNode);
    //   this.setHistory('delete', this.designerNode.displayName);
    // }
  };

  /** 克隆传入的节点，并替换节点key值 */
  private createNewNodeWithDifferentKey(
    node: IComponentSchema,
    parentKey: string
  ) {
    const newNode: IComponentSchema = JSON.parse(
      JSON.stringify({ ...node, children: [] })
    );
    newNode.key = guid();
    newNode.parent = parentKey;
    newNode.children = node.children.map((child) =>
      this.createNewNodeWithDifferentKey(child, newNode.key)
    );
    return newNode;
  }
}
