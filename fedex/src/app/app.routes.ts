import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'reactive-form',
    loadComponent: () =>
      import('@fedex/userprofile/feature/signup-reactiveform').then(
        (m) => m.SignupReactiveformComponent
      ),
  },
  {
    path: 'signals',
    loadComponent: () =>
      import('@fedex/userprofile/feature/signup-signals').then(
        (m) => m.SignupSignalsComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'reactive-form',
  },
];
