import { BasePaginationInput } from '@core';
import { UserWhereInput } from './user-where';
import { UserOrderInput } from './user-order';

export class UserPaginationInput extends BasePaginationInput(
  UserWhereInput,
  UserOrderInput
) {}
