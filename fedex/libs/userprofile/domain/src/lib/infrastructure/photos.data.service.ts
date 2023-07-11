import { inject, Injectable } from '@angular/core';
import { ApiResourceService } from '@fedex/shared/api-resource';
import { Observable } from 'rxjs';
import { IPhoto } from '../entities/Photo';

const PHOTOS_RESOURCE = 'photos';

@Injectable({ providedIn: 'root' })
export class PhotosDataService {
  private apiResource = inject(ApiResourceService);

  loadPhoto = (lastNameLength: number): Observable<IPhoto> => {
    return this.apiResource.get<IPhoto>(
      {},
      `${PHOTOS_RESOURCE}/${lastNameLength}`
    );
  };
}
