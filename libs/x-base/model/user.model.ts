import { IXSelectable } from './selectable.model';
import { RhMenuDto, RhUserDto, RoleDto } from './menu.model';
import { WithNil } from './with-nil.model';
import { OpMode } from './base.model';

/**
 * 用户Session模型
 */
export interface RhUserSessionDto {
  /** 通用功能 */
  Functions?: IRhFunction[];
  /** 用户信息 */
  User: WithNil<RhUserDto>;
  /** 所属角色 */
  Roles?: RoleDto[];
  /** 可访问菜单列表 */
  Menus?: RhMenuDto[];
  /** 菜单功能 */
  MenuFunctions?: RhMenuDto[];
  Token?: RhUserAuthorizationDto;
}

export interface IRhFunction {
  FunctionCode: string;
  FunctionName: string;
  Id: number;
  Remark: string;
  /** 是否有通用权限 */
  hasGeneralAuth: boolean;
}

// /**
//  * 按钮权限模型
//  */
// export interface IRhButtonAuthDto {
//   key: string;
//   functionName: WithNil<string>;
// }

/**
 * 用户授权模型
 * @description 存储 /account/login 接口返回的信息 { "tokenType": "Bearer", "accessToken": "...", "expiresIn": 3600, "refreshToken": "..."}
 */
export class RhUserAuthorizationDto {
  /** 获取token时间(前端收到token的时间) */
  public acquireTime?: Date;
  constructor(
    /** token类型：Bearer */
    public TokenType: string,
    /** 访问token */
    public AccessToken: string,
    /** 过期秒数 */
    public ExpiresIn: number,
    /** 刷新token */
    public RefreshToken: string
  ) {}
}

/** 更新 Token */
export class RefreshTokenDto {
  constructor(
    /** Refresh Token */
    public RefreshToken: string
  ) {}
  static create(): RefreshTokenDto {
    return new RefreshTokenDto('');
  }
}

/**
 * 用户身份声明模型
 */
export class RhUserClaimsIdentityDto {
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    public UserDomain: WithNil<RhUserDomainDto> // 用户域信息
  ) {}
}

/**
 * 用户域信息
 */
export class RhUserDomainDto {
  constructor(
    public UserId: WithNil<string>, // 用户账号

    public FactoryCode: WithNil<string>, // 工厂代码

    public GroupCode: WithNil<string>, // 组织代码

    public SupplierCode: WithNil<string> // 供应商代码
  ) {}
}

/** 登录用户信息
 * @description   `AuthMode` 值为0或者3，会使用本地数据库登录，但是3不会验证密码，直接登录成功;
 * 所有其他情况(1,2...)会调用第三方接口验证
 */
export class RhLoginUserDto {
  constructor(
    /** 用户账号:如`admin` */
    public UserId: WithNil<string>,
    /** 用户密码 */
    public Password: WithNil<string>,
    /** 验证模式 */
    public AuthMode: WithNil<number>,
    public FactoryCode?: string
  ) {}
  static create(): RhLoginUserDto {
    return new RhLoginUserDto(null, null, 0);
  }
}

/** 用户账户信息 */
export class RhUserAccountInfo implements IXSelectable {
  constructor(
    /** 用户名称 */
    public UserName: WithNil<string>,
    /** 邮箱地址 */
    public EmailAddress: WithNil<string>,
    /** 名称 */
    public Name: WithNil<string>,
    /** 手机号码 */
    public PhoneNumber: WithNil<string>,
    /** 是否双重验证 */
    public IsTwoFactorEnabled: WithNil<boolean>,
    /** 用户企业微信号 */
    public EnterpriseWeChatId: WithNil<string>,
    /** 是否激活 */
    public IsActive: WithNil<boolean>,
    public OpSign: WithNil<OpMode> | number,
    public Id: WithNil<number>
  ) {}

  static create(): RhUserAccountInfo {
    return new RhUserAccountInfo(
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

/** 修改密码数据传输对象 */
export class RhUpdatePasswordDto {
  constructor(
    /** 用户编码 */
    public UserCode: string,
    /** 校验密码 */
    public ValidatePassword: string,
    /** 新密码 */
    public NewPassword: string,
    /** 重复新密码 */
    public RepeatPassword: string
  ) {}

  static create(): RhUpdatePasswordDto {
    return new RhUpdatePasswordDto('', '', '', '');
  }
}
