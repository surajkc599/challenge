import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentService } from '@fedex/shared/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiResourceService {
  private httpClient = inject(HttpClient);
  private environment = inject(EnvironmentService);

  private baseUrl = this.environment.baseUrl;

  get = <Output>(
    params: Record<string, string>,
    resource: string
  ): Observable<Output> => {
    const endpoint = `${this.baseUrl}/${resource}`;
    const queryParams = new HttpParams({ fromObject: params });

    return this.httpClient.get<Output>(endpoint, {
      params: queryParams,
    });
  };

  post = <Input, Output>(body: Input, resource: string): Observable<Output> => {
    const endpoint = `${this.baseUrl}/${resource}`;

    return this.httpClient.post<Output>(endpoint, body);
  };
}
