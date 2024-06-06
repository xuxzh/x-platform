import { RhSafeAny } from './any.model';
import { IRHInterfaceLocation } from './http-options.model';

export type RhMenuTreeVisibilityType = 'All' | 'Root';
export type RhThemeType = 'default' | 'compact' | 'dark';
// export type RhDynamicTableButtonLayoutType = 'inline';

/**
 * 项目配置对象模型
 */
export interface RhProjectConfigDto {
  /** 启用权限控制标识 */
  AuthorityUser: string;
  /** 菜单默认显示图标 */
  DefaultIcon: string;
  /** 是否启用菜单路由卫士 */
  EnableMenuGuard: boolean;
  /** 项目名称
   * @description 用于动态组件的ProjectName存储
   */
  ProjectName: string;
  /** web站点对应的端口号，一般用于nginx代理 */
  WebServerPort: number;
  /** Normal模式下的菜单开始层级 */
  MenuRouteLevel_Normal: string;
  /** 前缀路径，指nginx配置的前置路径，如:`/lcdp` */
  PrefixPath: string;
  /** 主路由路径
   * @description web项目中:main，工控端项目:industrialmain
   */
  MainPath: string;
  /** 主页路径(如:DefaultPage)*/
  MainPagePath: string;
  /** 登录页面路由路径 */
  LoginPath: string;
  /** 默认主题 */
  DefaultTheme: RhThemeType;
  /** 根菜单名称 */
  RootMenu: string;
  /** 在菜单树上显示所有菜单还是只显示当前设置菜单：All|Root */
  MenuTreeVisibility: RhMenuTreeVisibilityType;
  // /** 动态table button布局:置于行内|置于标题位置 */
  // DynamicTableButtonLayout: RhDynamicTableButtonLayoutType;
  /** 是否支持锁屏 */
  IsLockScreen: boolean;
  /**设置锁屏自动锁屏倒计时时长
   * @description -1表示永不执行自动锁屏，0表示一键锁屏，不起用定时器，即一键锁屏，在界面右上角的下拉菜单中
   */
  TriggerLockScreenTime: number;
  /** 当前版本 */
  Version: string;
  /** 版本设置开关 */
  VersionSetting: boolean;
  /** 对应工控端地址 */
  IndustrialUrl: string;
  /** 是否显示主题选择button */
  EnableThemeSelect: boolean;
  /** 是否显示刷新 */
  EnableRefresh: true;
  /** 动态表单分页参数持久化 */
  isDynamicFormOptionPersistence: boolean;
  // /** 物料树性列表配置数据 */
  // MaterialTreeConfigData: MaterialTreeConfigData;
  // /** 动态组件配置信息
  //  * @deprecated 请使用`Layout`下的对应组件配置
  //  */
  // DynamicComponentConfig: IDynamicComponentConfigDto;
  /** 默认公司名称，用于在`rh-lcdp`中设置默认的`FactoryCode` */
  DefaultCompanyName: string;
  /** 布局配置 */
  Layout: IProjectLayoutDto;
  /** 数据源配置 */
  Datasource: {
    /** 获取多语言翻译字段数据接口 */
    I18n: IRHInterfaceLocation;
    /** 获取通用授权下拉框列表接口 */
    FunctionAuth: IRHInterfaceLocation;
    /** 第三方授权登录接口 */
    login: IRHInterfaceLocation;
    /** 第三方授权获取资源和token接口 */
    setAuth: IRHInterfaceLocation;
    /** 第三方授权刷新token接口 */
    refreshAuth: IRHInterfaceLocation;
    /** 二次校验接口 */
    AuthConfirm: IRHInterfaceLocation;
  };
  [propName: string]: RhSafeAny;
}

export interface IProjectLayoutDto {
  Table: ITableLayoutDto;
  /** form配置 */
  Form: IFormLayoutDto;
  /** description配置 */
  Description: IDescriptionLayoutDto;
  /** Collapse配置 */
  Collapse: ICollapseLayoutDto;
  /** list配置 */
  List: IListLayoutDto;
  /** card配置 */
  Card: ICardLayoutDto;
}

export interface ITableLayoutDto {
  /** 默认的字段宽度 */
  DefaultFieldWidth: number;
  /** 默认table的整体高度 */
  DefaultTableHeight: string;
  /** 默认的操作列宽度 */
  DefaultOperationWidth: number;
  /** 默认的序号列宽度 */
  DefaultIndexWidth: number;
  /** 分页选项 */
  PageSizeOptions: number[];
}

/** 动态Form配置对象模型 */
export interface IFormLayoutDto {
  [propName: string]: RhSafeAny;
}
/** 动态Description配置对象模型 */
export interface IDescriptionLayoutDto {
  [propName: string]: RhSafeAny;
}
/** 动态Collapse配置对象模型 */
export interface ICollapseLayoutDto {
  [propName: string]: RhSafeAny;
}
/** 动态List配置对象模型 */
export interface IListLayoutDto {
  [propName: string]: RhSafeAny;
}
/** 动态Card配置对象模型 */
export interface ICardLayoutDto {
  [propName: string]: RhSafeAny;
}
