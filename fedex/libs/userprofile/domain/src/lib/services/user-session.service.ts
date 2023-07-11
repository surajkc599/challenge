import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private _fullNameSubject = new BehaviorSubject('');
  // Public observable to access user's full name at any point of time
  fullName$ = this._fullNameSubject.asObservable();

  set userName(userName: string) {
    this._fullNameSubject.next(userName);
  }
}
