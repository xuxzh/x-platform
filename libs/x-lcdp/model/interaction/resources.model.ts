/** 资源路径分隔符 */
export const FOLDER_SPLIT_SYMBOL = '/';

export class RhPageResourceItem<T> {
  constructor(public name: string, public origin: string[], public detail: T) {}
}

export type RhPageResourceGroup<T> = Record<string, RhPageResourceItem<T>>;

class RhIndexedItem {
  public path?: string[];
  constructor(
    public key: string,
    public name: string //public index: number
  ) {}
}

export type RhResourceItem<T> = RhResourceFolder<T> | RhResourceFile<T>;
export type RhResourceItems<T> = Record<string, RhResourceItem<T>>;

/** 资源目录 */
export class RhResourceFolder<T> extends RhIndexedItem {
  constructor(
    public override key: string,
    public override name: string,
    //public override index: number,
    public children: RhResourceItems<T>
  ) {
    super(key, name);
  }
}

/** 单项资源 */
export class RhResourceFile<T> extends RhIndexedItem {
  constructor(
    public override key: string,
    public override name: string,
    public detail?: T
  ) {
    super(key, name);
  }
}

/** 顶层资源目录 */
export class RhResourceRootFolder<T> extends RhResourceFolder<T> {
  constructor(
    public override key = 'root',
    public override name = '根目录',
    public override children: RhResourceItems<T> = {
      system: new RhResourceFolder(
        RH_SYSTEM_RESOURCE_FOLDER,
        '系统维护的资源【C#】',
        {}
      ),
      my: new RhResourceFolder(
        RH_MY_RESOURCE_FOLDER,
        '我的资源【开发中。。】',
        {}
      ),
      platform: new RhResourceFolder(
        RH_PLATFORM_RESOURCE_FOLDER,
        '平台资源【低代码平台】',
        {}
      ),
    }
  ) {
    super(key, name, children);
  }
}
/** 系统资源(C#接口资源) */
export const RH_SYSTEM_RESOURCE_FOLDER = 'System';
/** // TODO:我的资源 */
export const RH_MY_RESOURCE_FOLDER = 'My';
/** 指低代码平台页面管理中的资源 */
export const RH_PLATFORM_RESOURCE_FOLDER = 'Platform';
export type RhResourceOriginType = 'System' | 'My' | 'Platform';
