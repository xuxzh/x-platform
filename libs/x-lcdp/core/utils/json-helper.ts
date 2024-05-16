import {
  DateHelper,
  FileHelper,
  guid,
  MsgHelper,
  noop,
  ObjectHelper,
} from '@x/base/core';
import { JSON_SCHEMA_ROOT_KEY, OMIT_FIELD_DATAS } from '@x/lcdp/data';
import { IComponentSchema, XTemplateSchemaType } from '@x/lcdp/model';

/** Json schema帮助类，包含一些json schema的静态方法 */
export class XJsonSchemaHelper {
  static copySchemaNodeRecursive(
    data: IComponentSchema,
    dataSet: IComponentSchema,
    cb?: () => void
  ) {
    dataSet.children?.forEach((child, index) => {
      if (child.key === data.key) {
        // 复制数据，并新生成一个key
        const addSchemaData: IComponentSchema =
          this.cloneComponentSchemaData(data);
        // index+1,将新增的节点加在现有节点后面
        dataSet.children.splice(index + 1, 0, addSchemaData);
        cb?.();
      } else if (child?.children?.length) {
        this.copySchemaNodeRecursive(data, child, cb);
      }
    });
  }

  /** 复制选中的`component schema`数据 */
  static cloneComponentSchemaData(origin: IComponentSchema): IComponentSchema {
    //const updateTime = getCurrentTime();
    const tempData: IComponentSchema = ObjectHelper.cloneDeep(origin);
    tempData.key = guid();
    //tempData.updateTime = updateTime;
    return tempData;
  }

  /**
   * 处理模板JSON Schema
   * @param schemaJson 需要处理的JSON Schema
   * @param cb 回调处理函数
   * @param parent 父节点
   * @param cb 回调函数
   * @param offsetLevel 用于记录当前层级对于parent的相对层级，第一层为0
   */
  static compJsonSchemaRecursive(
    schemaJson: IComponentSchema[],
    parent: IComponentSchema,
    cb: (
      data: IComponentSchema,
      parent: IComponentSchema,
      offsetLevel?: number,
      index?: number
    ) => void,
    offsetLevel = 0
  ) {
    if (schemaJson?.length) {
      schemaJson.forEach((child, index) => {
        cb?.(child, parent, offsetLevel, index);
        if (child.children?.length) {
          offsetLevel = offsetLevel + 1;
          this.compJsonSchemaRecursive(child.children, child, cb);
        }
      });
    }
  }

  /** 导出设计页面JSON数据 */
  static exportJSON(
    data?: IComponentSchema,
    name?: string
  ): Promise<Error | null> {
    return new Promise((resolve, reject) => {
      try {
        // if (!data) data = this.jsonSchemaDataset;
        if (!data?.children?.length) {
          MsgHelper.ShowInfoMessage(`设计数据为空，无需导出!`);
          resolve(null);
          return;
        }
        MsgHelper.ShowGlobalLoadingMessage(`正在导出数据，请稍候`);
        FileHelper.downloadByContent(
          this.jsonSchemaDataStringifyHandler(data, 2),
          name || DateHelper.format(new Date()),
          'application/json'
        );
        setTimeout(() => {
          resolve(null);
        }, 2000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * JSON Schema导出处理方法，需要忽略`select/check/expand`等属性
   * @param data json schema数据
   * @param space json格式化的缩进量,如`2`
   * @returns 转换后的json
   */
  static jsonSchemaDataStringifyHandler(
    data: IComponentSchema,
    space = 2
  ): string {
    return JSON.stringify(
      data,
      function replacer(key, value) {
        return OMIT_FIELD_DATAS.indexOf(key) !== -1 ? void 0 : value;
      },
      space
    );
  }

  /**
   * template schema导出处理方法，需要忽略一些特定字段并且处理guid字段
   * @param data 需要导出的模板数据
   * @param space 缩进量
   * @returns 装换后的json
   */
  static templateSchemaStringifyHandler(
    data: XTemplateSchemaType,
    space = 2
  ): string {
    let targetJson = JSON.stringify(
      data,
      function replacer(key, value) {
        // 动态组件配置中的hostConfig的信息需要保留，只清空`fieldsConfig`
        if (
          [...OMIT_FIELD_DATAS, JSON_SCHEMA_ROOT_KEY, 'fieldsConfig'].indexOf(
            key
          ) !== -1
        ) {
          return void 0;
        } else {
          return value;
        }
      },
      space
    );
    // 匹配不以@开头的guid,即忽略扩展包的guid
    targetJson = targetJson.replace(/[^@](\w{8}-\w{4}-4\w{1})/gm, (...args) => {
      if (args?.[1]) {
        if (args[0].startsWith(`"`)) {
          return `"{{guid:${args[1]}}}`;
        } else {
          return `{{guid:${args[1]}}}`;
        }
      }
      return args[0];
    });
    return targetJson;
  }

  /**
   * 将模板json转换为map树和json schema树
   * @param data 模板json
   * @description 处理模板中的{{guid:xxxxxxxx-xxxx-4x}}标识符，使用guid替换
   * @returns 模板Schema对象，包括Map树和Json schema树
   */
  static templateSchemaParseHandler(
    data: string | XTemplateSchemaType
  ): XTemplateSchemaType | null {
    if (!data) {
      return null;
    }
    if (typeof data === 'string') {
      const cache: Record<string, string> = {};
      // 先匹配扩展包的key，不改变其guid
      data = data.replace(
        /@\{\{guid:(\w{8}-\w{4}-4\w{1})\}\}/gm,
        (substr, ...args) => {
          return `@${args[0]}`;
        }
      );
      // 再匹配所有其他guid，使用新生成的guid替换
      data = data.replace(/\{\{guid:\w{8}-\w{4}-4\w{1}\}\}/gm, (value) => {
        const result = /\w{8}-\w{4}-4\w{1}/gm.exec(value);
        let tempGuid: string;
        if (result?.[0]) {
          tempGuid = cache[result[0] as string] || guid();
          cache[result[0] as string]
            ? noop()
            : (cache[result[0] as string] = tempGuid);
          return tempGuid;
        } else {
          return value;
        }
      });
      return JSON.parse(data);
    } else {
      return data;
    }
  }
}
