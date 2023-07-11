import { Injectable } from '@angular/core';
import { environment } from './environment';
import { IEnvironment } from './ienvironment';

@Injectable({ providedIn: 'root' })
export class EnvironmentService implements IEnvironment {
  get production() {
    return environment.production;
  }

  get baseUrl() {
    return environment.baseUrl;
  }
}
