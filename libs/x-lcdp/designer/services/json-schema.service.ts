import { Injectable, inject } from '@angular/core';
import { RhSafeAny, WithNil } from '@x/base/model';
import {
  JSON_SCHEMA_NODE_KEY,
  JSON_SCHEMA_ROOT_KEY,
  getInitialSchemaData,
} from '@x/lcdp/data';
import {
  DesignerComponentType,
  IComponentSchema,
  IPageSchema,
  XJsonSchemaOperationType,
  XSchemaOperationType,
} from '@x/lcdp/model';
import { XJsonMapData } from '@x/lcdp/core';
import { guid } from '@x/base/core';
import { XToolbarTabsService } from './toolbar-tabs.service';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * lcdp动态渲染服务
 */
@Injectable()
export class XJsonSchemaService {
  /** 完整的jsonSchemaData */
  private _jsonSchemaData: IPageSchema = getInitialSchemaData();

  jsonSchemaData$ = new Subject<IPageSchema>();

  /**
   * 完整的jsonSchemaData
   * @description 因为`jsonSchemaDataset`会在切换到子页面时发生变化，故新增此属性
   */
  get rootJsonSchemaDataset() {
    return this._jsonSchemaData;
  }

  tabSer = inject(XToolbarTabsService);

  private _isRunTime = false;

  /** 标识当前是否处于运行状态
   * @description 运行状态下可以做些性能优化，比如无需监听`jsonSchemaDataset`/`designerNodeData等`
   */
  set isRuntime(status: boolean) {
    this._isRunTime = status;
  }

  get isRunTime(): boolean {
    return this._isRunTime;
  }

  private _jsonSchemaDatasetSubject = new BehaviorSubject<IPageSchema>(
    getInitialSchemaData()
  );

  get jsonSchemaDataset$() {
    return this._jsonSchemaDatasetSubject.asObservable();
  }

  /** 刷新`JSON Schema`的操作类型，用于消费者判定，自身组件内的`DesignerNode`是否需要刷新 */
  jsonSchemaOperationType: XJsonSchemaOperationType = null;

  /** 将节点添加到容器组件中
   * @param parentContainerData 父节点。如果父节点不存在，表示当前节点要插到子页面中。
   * @description 将节点添加到容器组件中，一般需要再加一层`type`为`void`的子容器层。
   */
  addSchemaDataToContainer(
    data: IComponentSchema,
    parentContainerData?: IPageSchema,
    insertIndex = 0
  ) {
    if (!parentContainerData) {
      const subPageNode = this.createSubPage(data.displayName);
      data.parent = subPageNode.key;
      subPageNode.children = [data];
      this.rootJsonSchemaDataset.subPages.push(subPageNode); //.splice(insertIndex, 0, subPageNode);
      this.tabSer.selectedTabIndex =
        this.rootJsonSchemaDataset.subPages.length - 1;
      XJsonMapData.set(subPageNode);
    } else {
      parentContainerData.children = parentContainerData.children || [];
      parentContainerData.children.splice(insertIndex, 0, data);
    }
    XJsonMapData.set(data);
    this.refreshCurTabSchemaData();
  }

  /**
   * 根据键值查找目标节点
   * @param key 键值
   * @param errorMsg 是否需要未找到节点的提示(throw error)
   */
  findTargetSchemaNodeData(
    key: string,
    errorMsg = true
  ): WithNil<IComponentSchema> {
    //console.log(key);
    if (!key) {
      throw new Error('寻找Scheme节点时传入了空的key');
    }
    let target: WithNil<IComponentSchema> = null;
    // 如果传入的是子页面key，重定向为主页面的key
    if (key === JSON_SCHEMA_NODE_KEY) {
      key = JSON_SCHEMA_ROOT_KEY;
    }
    target = this.findTargetSchemaData(key);
    if (target) {
      return target;
    } else {
      if (errorMsg) throw new Error(`寻找Schema节点失败,key:${key}`);
      else return null;
    }
  }

  refreshSchemaData(type: XSchemaOperationType, data?: IComponentSchema) {
    switch (type) {
      case 'refresh':
        this.jsonSchemaData$.next(this._jsonSchemaData);
        break;
      default:
        this._jsonSchemaData = data as IPageSchema;
        this.jsonSchemaData$.next(data as IPageSchema);
    }
  }

  /** 新建子页面 */
  createSubPage(
    name: string,
    addToJson = false,
    rootJson: IPageSchema = this.rootJsonSchemaDataset,
    nodeOptions: Partial<IComponentSchema> = {},
    handleRootJson?: (json: IPageSchema, node: IComponentSchema) => void
  ) {
    if (!rootJson.subPages) rootJson.subPages = [];
    const node: IComponentSchema = {
      key: 'subPage@' + guid(),
      name: '',
      displayName: name,
      type: 'sub-page',
      compType: DesignerComponentType.SubPage,
      parent: JSON_SCHEMA_ROOT_KEY,
      children: [],
      ...nodeOptions,
    };
    if (addToJson) {
      rootJson.subPages.push(node);
      XJsonMapData.set(node);
    }
    if (handleRootJson) {
      handleRootJson(rootJson, node);
    }
    return node;
  }

  /**
   * 从jsonMap中查找到目标数据。如果map中查找不到，就从json中递归查找，json中查到后，再反写回map中
   * @param key 目标数据key值，仅做提示用
   * @returns 目标json Schema数据
   */
  private findTargetSchemaData(key: string): IComponentSchema {
    if (!key) throw new Error('查找节点时传入了空的key');
    let target: IComponentSchema | undefined = XJsonMapData.get(key);
    if (!target) {
      const find = (node: IComponentSchema): IComponentSchema | undefined => {
        if (node.key == key) return node;
        return node.children.find((item) => find(item));
      };
      const rootJson = this.rootJsonSchemaDataset;
      if (key == JSON_SCHEMA_ROOT_KEY) return rootJson;
      target = find({
        ...rootJson,
        children: [...rootJson.children, ...(rootJson.subPages || [])],
      });
      if (!target) throw new Error(`目标节点【${key}】不存在！`);
      else {
        XJsonMapData.set(target);
        return target;
      }
    }
    return target;
  }

  /** 刷新当前（子）页面 */
  private refreshCurTabSchemaData() {
    const target =
      this.tabSer.selectedTabIndex == -1
        ? this.rootJsonSchemaDataset
        : this.rootJsonSchemaDataset.subPages[this.tabSer.selectedTabIndex];
    if (target && target.children) {
      target.children = [...target.children];
    }
    this.refreshSchemaData('refresh');
  }
}
