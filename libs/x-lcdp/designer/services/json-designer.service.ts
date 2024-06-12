import { Injectable, inject } from '@angular/core';
import { MsgHelper, ObjectHelper, guid } from '@x/base/core';
import { IDisplay, RhSafeAny, WithNil } from '@x/base/model';
import {
  DesignerComponentType,
  IComponentFieldSetting,
  INodeSchema,
  IComponentResource,
  IComponentSchema,
  IPageSchema,
  XJsonSchemaOperationType,
} from '@x/lcdp/model';
import { isNotNil } from 'ng-zorro-antd/core/util';
import {
  DEFAULT_MIN_HEIGHT,
  JSON_SCHEMA_ROOT_KEY,
  getInitialSchemaData,
} from '@x/lcdp/data';
import { forEach, pull, camelCase } from 'lodash';

import { XJsonMapData, XJsonSchemaHelper } from '@x/lcdp/core';
import { XToolbarTabsService } from './toolbar-tabs.service';
import { XJsonSchemaService } from './json-schema.service';
import { Subject } from 'rxjs';

/**
 * 设计时的服务
 */
@Injectable()
export class XJsonDesignerService {
  tabSer = inject(XToolbarTabsService);
  jsonSchemaSer = inject(XJsonSchemaService);
  /** 指示当前选中的设计器节点 */
  #selectStatusObj: Record<string, boolean> = {};
  /** 指示当前选中的设计器节点
   * @description 赋值请使用`setSelectStatusObj`方法
   */
  get selectStatusObj(): Record<string, boolean> {
    return this.#selectStatusObj;
  }

  private _designerNode!: IComponentSchema | null;

  /** 当前在设计器中选中的node节点 */
  get designerNode() {
    return this._designerNode as IComponentSchema;
  }

  set designerNode(node: IComponentSchema | null) {
    this._designerNode = node;
  }

  /** 刷新`JSON Schema`的操作类型，用于消费者判定，自身组件内的`DesignerNode`是否需要刷新 */
  designNodeOperationType: XJsonSchemaOperationType = null;

  /** 完整的jsonSchemaData */
  private _jsonSchemaDataset: IPageSchema = getInitialSchemaData();

  /**
   * 完整的jsonSchemaData
   * @description 因为`jsonSchemaDataset`会在切换到子页面时发生变化，故新增此属性
   */
  get rootJsonSchemaDataset() {
    return this._jsonSchemaDataset;
  }

  /** 设计器选中的节点对应的组件树下拉框 */
  selectCompTreeDataSet: IDisplay[] = [];

  /** 指示设计大小发生变化 */
  designerResize$ = new Subject<boolean>();

  /** 置null`_designerNode` */
  clearDesignerNode() {
    this.changeDesignerNode(null);
  }

  changeDesignerNode(node: INodeSchema | null) {
    this.designNodeOperationType = 'select';
    if (!node) {
      this.designerNode = null;
    } else {
      this.designerNode = node;
      this.setSelectStatusObj(node.key);
    }
  }

  copySchemaData(data: IComponentSchema) {
    XJsonSchemaHelper.copySchemaNodeRecursive(
      data,
      this.rootJsonSchemaDataset,
      () => this.refreshSchemaData('copy')
    );
  }

  setSelectStatusObj(key: string) {
    this.#selectStatusObj = { [key]: true };
  }

  /** 判断对象是否是`RhComponentSchemaDto`类型 */
  isComponentSchemaDto(
    data: IComponentSchema | IComponentResource
  ): data is IComponentSchema {
    return isNotNil(data.key);
  }

  /**
   * 根据组件资源对象生成唯一的组件schema对象
   * @param data 组件资源对象
   * @returns 组件Schema对象
   */
  getJsonSchema(
    data: IComponentResource,
    targetIndex: number,
    compConfig: Record<string, RhSafeAny>,
    mappedDataSet: Record<DesignerComponentType, IComponentFieldSetting[]>,
    parent: IComponentSchema
  ): WithNil<IComponentSchema> {
    if (!data?.name) {
      return;
    }
    const tempCompResourceDto = ObjectHelper.pick(data, [
      'name',
      'displayName',
      'key',
      'description',
      'type',
    ]);

    const compProps = data?.['x-component-props'] || ``;
    this.getComponentProps(
      data.name as DesignerComponentType,
      compConfig,
      mappedDataSet
    );
    // const grandPaData = this.g;
    let nodeData: Partial<IComponentSchema> = {};

    nodeData = {
      key: guid(),
      // title: tempCompResourceDto.description,
      select: false,
      type: tempCompResourceDto.type,
      compType: tempCompResourceDto.name as DesignerComponentType,
      name: this.setJsonSchemaName(
        tempCompResourceDto.name as DesignerComponentType
      ),
      displayName: tempCompResourceDto.displayName,
      description: tempCompResourceDto.description,
      //updateTime: updateTime,
      parent: parent.key,
      // icon: tempCompResourceDto.icon,
      'x-component': tempCompResourceDto.name,
      'x-component-props': compProps,
      'x-component-styles': this.getDefaultStyle(data.type),
      'x-wrapper-styles': {},
      'x-component-events': {},
      'x-component-class': null,
    };

    // 操作json map的数据
    XJsonMapData.set(nodeData as IComponentSchema);

    // if (data.type === 'container') {
    /** 如果该容器有子容器或附加容器，需要初始化至少一个子容器 或 展示组件内也可以拥有可拖入的子项*/
    if (data.hasChildContainer) {
      // 容器组件默认至少有一个子容器
      // const colCount =
      //   compConfig?.['rhColCount'] || compProps?.['rhColCount'] || 1;
      // nodeData.children = nodeData.children || [];
      // // 自动生成子容器节点
      // for (let index = 0; index < colCount; index++) {
      //   const tempData: IComponentSchema = this.initChildContainerData(
      //     nodeData as IComponentSchema,
      //     index /* , nodeData.updateTime */
      //   );
      //   nodeData.children.push(tempData);
      //   XJsonMapData.set(tempData);
      // }
    } else {
      nodeData.children = [];
    }

    return nodeData as IComponentSchema;
  }

  /**
   * 根据组件名称获取默认组件配置
   * @param componentName 组件名称
   */
  getComponentProps(
    componentName: string,
    compConfig: Record<string, RhSafeAny>,
    mappedDataSet: Record<string, IComponentFieldSetting[]>
  ) {
    if (!componentName?.trim()) {
      return {};
    }
    const temp: Record<string, RhSafeAny> = {};
    const configDatas: IComponentFieldSetting[] = mappedDataSet[componentName];
    configDatas?.forEach((ele) => {
      // 有值时才进行赋值
      if (isNotNil(ele?.defaultValue) || isNotNil(compConfig?.[ele.name])) {
        temp[ele.name] = compConfig?.[ele.name] || ele.defaultValue;
      } else {
        temp[ele.name] = null;
      }
    });
    return temp;
  }

  /**
   * 删除当前json中的节点。即使删除的是子页面中的顶层节点，也会正确删除节点。
   * @param data 需要删除的Schema节点
   * @param checkRootJsonWhenNotFound 删除过程中会根据节点上的parent值查找父节点。如果parent异常导致找不到节点，在此标志置为true的情况下，此方法会遍历json来强制删除此节点。
   * @description
   * @returns 被删除节点的父节点
   */
  removeSchemaData(data: IComponentSchema, checkRootJsonWhenNotFound = true) {
    try {
      if (!data) throw '传入的待删除节点为空值！';
      if (data.key == JSON_SCHEMA_ROOT_KEY) {
        //如果删除的是页面节点
        return this.resetSchemaData();
      }
      const parent = this.findTargetSchemaData(data.parent as any);
      if (!parent) throw '找不到待删除节点的父节点！';
      const children = this.isPageSchema(parent)
        ? parent.subPages || []
        : parent.children;
      const targetIndex = children.findIndex((item) => item.key == data.key);
      if (targetIndex != -1) children.splice(targetIndex, 1);
      else {
        if (checkRootJsonWhenNotFound) {
          //启用标志的情况下，强制从json中找到此节点，进行删除
          const rootJson = this.rootJsonSchemaDataset;
          const target = rootJson.subPages?.find(
            (item) => item.key == data.key
          );
          if (target) {
            data = target;
            pull(rootJson.subPages, target);
          } else {
            const find = (nodes: IComponentSchema[]) => {
              let found = false;
              forEach(nodes, (node) => {
                const target = node.children.findIndex(
                  (item) => item.key == data.key
                );
                if (target != -1) {
                  data = node.children[target];
                  node.children.splice(target, 1);
                  found = true;
                  return false;
                } else {
                  found = find(node.children);
                  return !found;
                }
              });
              return found;
            };
            find([rootJson, ...rootJson.subPages]);
          }
        } else {
          MsgHelper.ShowInfoMessage(
            '找不到待删除节点的父节点，可能是parent值错误！'
          );
          return null;
        }
      }
      this.removeRelatedMapData(data as IPageSchema);
      this.refreshSchemaData('delete');
      return parent;
    } catch (error) {
      MsgHelper.ShowErrorMessage(`删除节点时发生错误:${error}`);
      return null;
    }
  }

  /**
   * 从jsonMap中查找到目标数据。如果map中查找不到，就从json中递归查找，json中查到后，再反写回map中
   * @param key 目标数据key值，仅做提示用
   * @returns 目标json Schema数据
   */
  findTargetSchemaData(key: string): IComponentSchema {
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

  /** 重置JSON Schema */
  resetSchemaData() {
    this.tabSer.resetTatSetDatas();
    const newJson = getInitialSchemaData();
    this.refreshSchemaData('init', newJson);
    return newJson;
  }

  private getDefaultStyle(type: string) {
    if (type == 'special')
      return { height: '100%', width: '100%', minHeight: '100px' };
    const defaultStyle =
      type === 'container' ? { minHeight: DEFAULT_MIN_HEIGHT } : {};
    return defaultStyle;
  }

  /** 删除节点后，递归删除节点及其子节点的mapData */
  removeRelatedMapData(data: IPageSchema) {
    const removeMapData = (data: IPageSchema) => {
      XJsonMapData.delete(data.key);
      if (data?.children?.length) {
        data.children.forEach((ele) => {
          removeMapData(ele as IPageSchema);
        });
      }
    };
    removeMapData(data);
  }

  /**
   * 刷新JSON Schema数据源
   * @param operationType 操作类型，用于表示当前刷新schema的操作类型，供消费者判断。注意`init`类型，会重新初始化整个页面的状态；
   * @param data 整个页面的`JsonSchemaDataset`，如果不传会默认使用当前页面的配置对象，请勿随意传入JsonSchema对象
   */
  refreshSchemaData(
    operationType: XJsonSchemaOperationType,
    data?: IPageSchema
  ) {
    if (operationType == 'select') return;
    //
  }

  /** 删除节点 */
  deleteNode(node: INodeSchema | null = this.designerNode, setHistory = true) {
    if (!node) return;
    if (node.key == JSON_SCHEMA_ROOT_KEY) return; //暂且不让删根节点
    const parent = this.removeSchemaData(node);
    this.changeDesignerNode(parent);
  }

  private setJsonSchemaName(compType: DesignerComponentType) {
    let index = 1;
    // for (const key in RhJsonMapData.get()) {
    //   if (Object.prototype.hasOwnProperty.call(RhJsonMapData.get(), key)) {
    //     const element = RhJsonMapData.get(key);
    //     if (element.compType === compType) {
    //       index += 1;
    //     }
    //   }
    // }
    for (const value of XJsonMapData.get().values()) {
      if (value.compType === compType) {
        index += 1;
      }
    }
    return `${camelCase(compType)}${index}`;
  }

  isPageSchema(node: INodeSchema): node is IPageSchema {
    return Object.hasOwnProperty.call(node, 'subPages');
  }

  isComponentSchema(node: INodeSchema): node is IComponentSchema {
    return !!node.compType;
  }

  /**
   * 使用导入的Json文件初始化页面
   * @param file 外部导入的Json文件
   * @returns
   */
  loadJsonSchemaFromJsonFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (file.type !== 'application/json') {
        MsgHelper.ShowErrorMessage(`请选择json文件！`);
        reject(true);
        return;
      }
      const fileReader = new FileReader();
      fileReader.readAsText(file as RhSafeAny);
      fileReader.onload = () => {
        try {
          const JsonData = fileReader.result;
          this.loadJsonSchemaFromJson(JsonData as string);
          resolve(true);
        } catch (error) {
          MsgHelper.ShowErrorMessage(error as RhSafeAny);
          reject(true);
        }
      };
      fileReader.onerror = (e) => {
        MsgHelper.ShowErrorMessage(`读取文件发生错误:${e}`);
        reject(true);
      };
    });
  }

  /**
   * 使用json字符串对象初始化页面
   * @param json json字符串
   */
  loadJsonSchemaFromJson(json: string | object) {
    try {
      if (!json) {
        throw new Error('文件为空或文件格式错误，请检查后重试！');
      }
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      if (!data?.key || !data?.type || !data?.children) {
        throw new Error(
          'json格式错误，对象没有key和type属性,请检查导入的是否为页面JSON后重试！'
        );
      }
      // if (this.designerNode?.compType === 'basic-form' || this.designerNode?.compType === 'basic-table') {
      //   this.loadSingleJsonData(data);
      // } else {
      //const tempTime = getCurrentTime();
      //data.createTime = data.updateTime = tempTime;
      /*         RhJsonSchemaHelper.compJsonSchemaRecursive(data.children, data, (data) => {
                    //data.updateTime = tempTime;
                  }); */
      // this.jsonSchemaDataset = data;
      // this.initMapData(this.jsonSchemaDataset);
      this.jsonSchemaSer.refreshSchemaData('init', data);
      // }
      MsgHelper.ShowSuccessMessage(`配置加载成功！`);
    } catch (error) {
      throw new Error(`将JSON解析为页面配置时发生错误：${error}`);
    }
  }

  // /** 初始化子容器数据 */
  // initChildContainerData(
  //   parent: IComponentSchema,
  //   index: number /* , updateTime?: string */
  // ): IComponentSchema {
  //   //updateTime = updateTime || getCurrentTime();
  //   const name = `${parent.name}`;
  //   const compType = `child-${parent.compType}`;
  //   const displayName = this.getChildContainerDisplayName(parent);
  //   const defaultId = guid(4);
  //   const props = this.getChildContainerProps(
  //     compType as DesignerComponentType,
  //     index,
  //     defaultId
  //   );
  //   const nodeData: Partial<IComponentSchema> = {
  //     key: guid(),
  //     // containerId: `${parent.compType}_${updateTime}_${index}`,
  //     //updateTime: updateTime,
  //     compType: compType,
  //     type: 'void',
  //     name: `${name}_${defaultId}`,
  //     displayName: `${displayName}_${defaultId}`,
  //     parent: parent.key,
  //     'x-component': compType,
  //     'x-component-props': props,
  //     'x-component-styles': {
  //       minHeight: DEFAULT_MIN_HEIGHT,
  //     },
  //     'x-component-events': {},
  //     children: [],
  //   };
  //   return nodeData as IComponentSchema;
  // }

  // private getChildContainerDisplayName(
  //   containerComp: RhComponentSchemaDto
  // ): string {
  //   return containerComp.compType in CHILD_CONTAINER_DISPLAY_NAME_MAPPED_DATA
  //     ? CHILD_CONTAINER_DISPLAY_NAME_MAPPED_DATA[containerComp.compType]
  //     : '子容器';
  // }

  // private getChildContainerProps(
  //   compType: DesignerComponentType,
  //   index: number,
  //   fieldId?: string
  // ): Record<string, RhSafeAny> {
  //   const temp: Record<string, RhSafeAny> = {};
  //   const targetComp = COMPONENT_FIELD_SETTING_MAPPED?.[compType];
  //   if (!targetComp) {
  //     return temp;
  //   } else {
  //     targetComp.forEach((ele) => {
  //       if (typeof ele.defaultValue === 'string') {
  //         temp[ele.name] = ele.defaultValue.replace(
  //           /\{\{index\}\}/g,
  //           () => `${index + 1}`
  //         );
  //         temp[ele.name] = temp[ele.name].replace(
  //           /\{\{key\}\}/g,
  //           () => `${fieldId}`
  //         );
  //       } else {
  //         temp[ele.name] = ele.defaultValue;
  //       }
  //     });
  //     return temp;
  //   }
  // }
}
