import { inject, Injectable } from '@angular/core';
import { ApiResourceService } from '@fedex/shared/api-resource';
import { IUser, UserDetails } from '../..';

const USERS_RESOURCE = 'users';

@Injectable({ providedIn: 'root' })
export class UsersDataService {
  private apiResource = inject(ApiResourceService);

  postUser = (user: IUser) => {
    return this.apiResource.post<IUser, UserDetails>(user, USERS_RESOURCE);
  };
}
