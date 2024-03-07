import { inject } from '@angular/core';
import { ApiConfigService, BasePagination } from '@core';
import { UserDto } from '@model';
import { Apollo, gql } from 'apollo-angular';
import { UserPaginationInput } from './user-pagination.input';
import { Observable, map } from 'rxjs';
import { cloneDeep } from 'lodash-es';

export class UserManageService {
  apiConfigSer = inject(ApiConfigService);
  apollo = inject(Apollo);
  user(id: number) {
    return this.apollo.query<{ user: UserDto }>({
      variables: { id },
      query: gql`
        query User($id: ID!) {
          user(id: $id) {
            Id
            UserCode
            UserName
          }
        }
      `,
    });
  }

  users(input: UserPaginationInput): Observable<BasePagination<UserDto>> {
    return this.apollo
      .query<{ users: BasePagination<UserDto> }>({
        variables: input,
        query: gql`
          query Users(
            $skip: Int
            $take: Int
            $where: UserWhereInput
            $orderBy: [UserOrderInput!]
          ) {
            users(skip: $skip, take: $take, where: $where, orderBy: $orderBy) {
              count
              data {
                Id
                UserCode
                UserName
              }
            }
          }
        `,
      })
      .pipe(map((x) => cloneDeep(x.data?.users)));
  }
}
