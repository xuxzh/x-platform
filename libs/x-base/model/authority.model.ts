import { RhMenuDto, RhUserDto, RoleDto } from './menu.model';
import { IRhFunction } from './user.model';
import { WithNil } from './with-nil.model';

/**
 * 用户Session模型
 */
export interface IXUserSessionDto {
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
  Token?: IXUserAuthorizationDto;
}

/**
 * 用户授权模型
 * @description 存储 /account/login 接口返回的信息 { "tokenType": "Bearer", "accessToken": "...", "expiresIn": 3600, "refreshToken": "..."}
 */
export interface IXUserAuthorizationDto {
  /** 获取token时间(前端收到token的时间) */
  acquireTime?: Date;
  /** token类型：Bearer */
  TokenType: string;
  /** 访问token */
  AccessToken: string;
  /** 过期秒数 */
  ExpiresIn: number;
  /** 刷新token */
  RefreshToken: string;
}
