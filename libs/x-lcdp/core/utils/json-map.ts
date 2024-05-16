import { RhSafeAny } from '@x/base/model';
import { IComponentSchema, IPageSchema } from '@x/lcdp/model';

/**
 * JSON Schema树形数据对应的一维数据
 */
export class XJsonMapData {
  private static _mapData = new Map<string, IComponentSchema>();

  static getKey(data: IComponentSchema) {
    // data.createTime = data.createTime || getCurrentTime();
    // return data?.createTime ? `${data.key}_${data.createTime}` : `${data.key}`;
    return data.key;
  }

  /** 传入页面json,初始化jsonMap */
  static initFromPage(page: IPageSchema) {
    this._mapData.clear();
    this.autoAddDataFromJson([page]);
    this.autoAddDataFromJson(page.subPages || []);
  }

  /**
   * 设置值
   * @param data 节点数据
   */
  static set(data: IComponentSchema) {
    const mapKey = this.getKey(data);
    if (!mapKey) return;
    this._mapData.set(mapKey, data);
    // console.log(this._mapData);
  }

  /**
   * 根据key获取配置
   * @param key 键
   */
  static get(key: string): IComponentSchema;
  /**
   * 获取整个map数据
   */
  static get(): Map<string, IComponentSchema>;

  static get(...args: RhSafeAny[]) {
    if (args.length === 0) {
      return this._mapData;
    } else if (args.length === 1 && typeof args[0] === 'string') {
      return this._mapData.get(args[0]);
    } else {
      throw new Error('参数类型错误');
    }
  }

  static delete(key: string): void;
  static delete(key: string[]): void;

  static delete(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach((ele) => {
        this.delete(ele);
      });
    } else {
      if (key) {
        this._mapData.delete(key);
      }
    }
    // 此处无需进行遍历删除子节点数据，遍历操作在删除对应schema数据时进行；
  }

  /** 获取指定节点的父节点map数据 */
  static getParent(key: string) {
    const node = this._mapData.get(key);
    if (!node || !node.parent) return null;
    return this._mapData.get(node.parent);
  }
  /** 将json中的数据自动添加进去 */
  static autoAddDataFromJson(data: IComponentSchema[]) {
    data.forEach((item) => {
      //删除旧版json的level、loc、updateTime、createTime等字段
      delete item['level'];
      delete item['loc'];
      delete item['updateTime'];
      delete item['createTime'];
      this.set(item);
      if (item.children && item.children.length > 0)
        this.autoAddDataFromJson(item.children);
    });
  }

  /** 删除节点 */
  static removeDataOfNodeAndItsChildren(data: IComponentSchema) {
    this._mapData.delete(data.key);
    data.children.forEach((child) =>
      this.removeDataOfNodeAndItsChildren(child)
    );
  }

  static find(
    predicate: (ele: IComponentSchema) => boolean,
    cb?: (node: IComponentSchema) => void
  ) {
    let targetNode: IComponentSchema | null = null;
    for (const value of this._mapData.values()) {
      if (predicate(value)) {
        targetNode = value;
      }
    }
    return targetNode;
  }
}

(window as RhSafeAny).mapHelper = XJsonMapData;
