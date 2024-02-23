import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'passport',
    loadChildren: () =>
      import('./routes/passport/passport-routing.module').then(
        (m) => m.PassportRoutingModule
      ),
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./routes/main/main-routing.module').then(
        (m) => m.MainRoutingModule
      ),
  },
  {
    path: '',
    redirectTo: 'passport',
    pathMatch: 'full',
  },
];
