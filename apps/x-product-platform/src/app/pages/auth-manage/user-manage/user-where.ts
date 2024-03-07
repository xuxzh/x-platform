import { BaseWhereInput, StringFilter } from '@core';

export class UserWhereInput extends BaseWhereInput<UserWhereInput> {
  UserCode?: StringFilter;
  UserName?: StringFilter;
}
