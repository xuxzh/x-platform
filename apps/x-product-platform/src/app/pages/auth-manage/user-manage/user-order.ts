import { BaseOrder, SortOrder } from '@core';

export class UserOrderInput extends BaseOrder {
  name?: SortOrder;
  account?: SortOrder;
  email?: SortOrder;
  phone?: SortOrder;
}
