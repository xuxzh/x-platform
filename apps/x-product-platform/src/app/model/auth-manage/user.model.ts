import { BaseModel } from '@core';

export interface UserQueryDto {
  UserCode: string;
  UserName: string;
}

export interface UserDto extends BaseModel {
  UserCode: string;
  UserName: string;
  Remark: string;
}
