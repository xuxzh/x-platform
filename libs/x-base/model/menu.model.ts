import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { IRhFunction } from './user.model';
import { WithNil } from './with-nil.model';
import { IXSelectable } from './selectable.model';

export enum RhMenuType {
  Menu = 0,
  Button = 1,
}

/** 用户和对应资源模型 */
export class RhPostLoginInfoDto {
  /** 用户的菜单按钮权限 */
  public MenuFunctions!: RhMenuDto[];
  constructor(
    /** 当前用户 */
    public User: RhUserDto,
    /** 用户的角色 */
    public Roles: RoleDto[],
    /** 用户的菜单 */
    public Menus: RhMenuDto[],
    /** 用户的功能 */
    public Functions: IRhFunction[]
  ) {}
}

/** 用户注册数据传输对象 */
export class RhUserDto {
  public login = false;
  public lock = false;
  public CompanyCode?: string;
  /** 中文姓名
   * @description 仅适用于`MOM`项目
   */
  public Name?: string;
  constructor(
    /** */
    public Id: number,
    /** 用户编码 */
    public UserCode: string,
    /** 用户真实名称（员工的真实名称）
     * @description 在MOM项目中使用`Name`表示用户中文姓名
     */
    public UserName: string,
    /** 规范化用户名 */
    public NormalizedUserName: string,
    /** 密码 */
    public Password: string,
    /** 邮箱地址 */
    public EmailAddress: string,
    /** 规范化邮箱地址 */
    public NormalizedEmail: string,
    /** 手机号 */
    public PhoneNumber: string,
    /** 上次登录时间 */
    public LastLoginTime: Date,
    /** 用户是否激活 */
    public IsActive: boolean,
    /** 用户组id */
    public UserGroupId: number,
    /** 用户组编码 */
    public UserGroupCode: string,
    /** 用户组名 */
    public UserGroupName: string,
    /** 访问失败次数 */
    public AccessFailedCount: number,
    /** 是否锁定 */
    public IsLockoutEnabled: boolean,
    /** 手机号是否确认 */
    public IsPhoneNumberConfirmed: boolean,
    /** 邮箱是否确认 */
    public IsEmailConfirmed: boolean,
    /** 锁定结束日期 */
    public LockoutEndDateUtc: Date,
    /** 安全戳 */
    public SecurityStamp: string,
    /** 是否用两步验证 */
    public IsTwoFactorEnabled: boolean,
    /** 用户类型 */
    public UserType: string,
    /** 部门代码 */
    public OrganizationStructureCode: string,
    /** 部门Id */
    public OrganizationUnitId: number,
    /** 部门名称 */
    public OrganizationStructureName: string,
    /** 角色组 */
    public Roles: RoleDto[],
    /** 需要修改的字段 */
    public NeedUpdateFields: string,
    /** */
    public Remark: string,
    /** 工厂代码(模型中没有，但是暂时加上去) */
    public FactoryCode: string
  ) {}
}

/** 角色数据传输对象 */
export class RoleDto {
  constructor(
    /** 角色账号 */
    public RoleId: string,
    /** 角色名称 */
    public RoleName: string,
    /** 是否静态 */
    public IsStatic: boolean,
    /** 是否默认 */
    public IsDefault: boolean,
    /** 备注 */
    public Remark: string
  ) {}
}

export class RhMenuDto {
  public isRefresh = false;
  public select = false;
  /** 是否启用 */
  public IsUse = false;
  public DisplayType: 'Hidden' | 'Prompt' | 'Confirm' | null = null;
  constructor(
    /** 自增主键 */
    public Id: number,
    /** 菜单编码 */
    public MenuCode: string,
    /** 菜单名称 */
    public MenuName: string,
    /** 菜单类型 */
    public MenuType: RhMenuType,
    /** 图标 */
    public Icon: string | null,
    /** 路由地址 */
    public Url: string,
    /** 是否可见，是否拼接到浏览器的路由地址
     * @description 注意：前端专用字段，注意旧产品用的的`IsEnable`来标注
     */
    public IsVisible: boolean,
    /** 层级 */
    public LevelLayer: number,
    /** 排序值 */
    public SortOrder: number,
    /** 路由出口 */
    public RouterOutlet: string,
    /** 显示窗口 */
    public TargetView: string | null,
    /** 自定义数据 */
    public CustomData: string | null,
    /** 是否启用,数据是否启用 */
    public IsEnable: boolean,
    /** 是否启用功能权限 */
    public IsUseFeaturePermission: boolean,
    /** 产品名称 */
    public ProductName: string,
    /** 显示名称 */
    public DisplayName: string,
    /** Id键值 */
    public IdKey: string,
    /** 上次修改时间 */
    public LastModificationTime: Date,
    /** 上次修改人ID */
    public LastModifierUserId: number,
    /** 上次修改人名称 */
    public LastModifierUserName: string,
    /** 创建时间 */
    public CreationTime: Date,
    /** 创建人Id */
    public CreatorUserId: number,
    /** 创建人名称 */
    public CreatorUserName: string,
    /** 父Id */
    public MenuParentId: string,
    /** */
    public OpSign: number,
    /** 子节点 */
    public Children: RhMenuDto[]
  ) {}
}

// /** 功能表 */
// export class FunctionDto {
//   constructor(
//     /** 功能编码 */
//     public FunctionCode: string,
//     /** 功能名称 */
//     public FunctionName: string,
//     /** */
//     public OpSign: number,
//     /** */
//     public Id: number
//   ) {}
// }

/** 菜单功能查询模型 */
export class RhMenuFeaturesQueryDto {
  constructor(
    /** 菜单键值 */
    public MenuName: WithNil<string>,
    /** 功能键值 */
    public FeatureName: WithNil<string>,
    /** 查询模式 */
    public Mode: WithNil<number>,
    /** 需要返回的结果数量 */
    public MaxResultCount = 10,
    /** 跳过的数量 */
    public SkipCount = 0
  ) {}

  static create(): RhMenuFeaturesQueryDto {
    return new RhMenuFeaturesQueryDto('', '', 0);
  }
}

/** 菜单功能权限模型 */
export class RhMenuFeatureAuthorityDto {
  public menuUrl?: string;
  constructor(
    /** 菜单键值 */
    public menuDto: WithNil<RhMenuNodeDto>,
    /** 当前菜单是否启用了权限控制 */
    public menuAuthorityOn: WithNil<boolean>,
    /** 菜单的权限功能菜单 */
    public menuFeatureAuthorityDatas: WithNil<string>[]
  ) {}
}

/**
 * 复用菜单模型
 */
export class RhReuseMenuDto {
  /** 完整的url,用于iframe保存完整的url */
  public fullUrl?: string;
  /** 图标 */
  public icon!: string;
  constructor(
    /** 选项卡标题 */
    public title: string,
    /** 路由地址 */
    public module: WithNil<string>,
    /** 是否复用 */
    public store: WithNil<boolean>,
    /** 当前是否选中 */
    public isSelect: WithNil<boolean>,
    /** 菜单键值 */
    public menuDto: WithNil<RhMenuNodeDto>
  ) {}

  static create() {
    return new RhReuseMenuDto('', null, false, false, null);
  }
}

/** 登陆的用户菜单模型 */
export class RhLoginedUserMenu {
  constructor(
    /**  */
    public UserCode: WithNil<string>,
    /** 用户名称 */
    public UserName: WithNil<string>,
    /** 菜单的Id */
    public MenuId: WithNil<number>,
    /** 菜单的键值 */
    public MenuName: WithNil<string>
  ) {}

  static create(): RhLoginedUserMenu {
    return new RhLoginedUserMenu(null, null, null, null);
  }
}

/** 菜单功能模型 */
export class RhMenuFeaturesDto implements IXSelectable {
  /** 是否是菜单功能 */
  public isFeature: WithNil<boolean>;
  constructor(
    /** 菜单键值 */
    public MenuName: WithNil<string>,
    /** 功能键值 */
    public FeatureName: WithNil<string>,
    /** 功能名称 */
    public FeatureDisplayName: WithNil<string>,
    /** 功能图标 */
    public FeatureIcon: WithNil<string>,
    /** 控制器名称 */
    public ApiControllerName: WithNil<string>,
    /** 操作名称 */
    public ApiActionName: WithNil<string>,
    /** 操作标志 */
    public OpSign: WithNil<number>,
    /** 创建用户名称 */
    public CreatorUserName: WithNil<string>,
    /** 自增键 */
    public Id: WithNil<number>
  ) {}

  static create(): RhMenuFeaturesDto {
    return new RhMenuFeaturesDto(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }
}

/**
 * web端专用的菜单模型
 * @description 仅用于主界面左侧菜单区域
 */
export class RhMenuNodeDto implements Partial<NzTreeNodeOptions> {
  public key!: string;
  public children!: NzTreeNodeOptions[];
  public parent: WithNil<RhMenuNodeDto>;
  /** 自定义选择树节点模型 */
  public isSelectedNode = false;
  /** 自定义选择树节点模型 */
  public menuType: RhMenuType = 0;
  constructor(
    public level: number,
    /** 标题(中文) */
    public title: string,
    /** 英文Name(菜单管理的唯一标识符) */
    public name: WithNil<string>,
    public icon: string,
    public route: WithNil<string>,
    public id: string,
    public sortId: number,
    /** 菜单在数据库中的key */
    public idNum: WithNil<number>,
    /** 是否启用权限控制菜单,默认为false */
    public IsUseFeaturePermission = false,
    /** 是否进行路由拼接 */
    public enable = true,
    /** 是否展开子菜单 */
    public open = false,
    public selected = false,
    public isLeaf = false
  ) {}
}
