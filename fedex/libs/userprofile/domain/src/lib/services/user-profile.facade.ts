import { inject, Injectable } from '@angular/core';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { IPhoto } from '../entities/Photo';
import { RequestStatus } from '../entities/RequestStatus';
import { IUser, UserStatus, User, UserDetails } from '../entities/User';
import { PhotosDataService } from '../infrastructure/photos.data.service';
import { UsersDataService } from '../infrastructure/users.data.service';

@Injectable({ providedIn: 'root' })
export class UserProfileFacade {
  private photosDataService = inject(PhotosDataService);
  private usersDataService = inject(UsersDataService);

  signUpUser = (user: User): Observable<UserStatus> => {
    return this.getPhoto(user.lastName.length).pipe(
      switchMap(({ thumbnailUrl }) =>
        this.createUser({
          ...user,
          thumbnailUrl,
        }).pipe(
          map((value) => ({
            data: value,
            status: RequestStatus.SUCCESS,
          }))
        )
      ),
      startWith({
        data: null,
        status: RequestStatus.INPROGRESS,
      })
    );
  };

  private getPhoto = (lastNameLength: number): Observable<IPhoto> => {
    return this.photosDataService.loadPhoto(lastNameLength);
  };

  private createUser = (user: IUser): Observable<UserDetails> => {
    return this.usersDataService.postUser(user);
  };
}
