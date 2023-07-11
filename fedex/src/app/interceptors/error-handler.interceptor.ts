import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestStatus } from '@fedex/userprofile/domain';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // For now Just do the logging stuff...
        if (error.error instanceof ErrorEvent) {
          console.log('Client side error');
        } else {
          console.log('Server side error');
        }
        return throwError(() => ({
          status: RequestStatus.ERROR,
          data: null,
        }));
      })
    );
  }
}
