import { BaseAudit } from '@core';

export interface UserQueryDto {
  UserCode: string;
  UserName: string;
}

export interface UserDto extends BaseAudit {
  UserCode: string;
  UserName: string;
  Remark: string;
}
