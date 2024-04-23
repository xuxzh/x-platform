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
    path: 'designer',
    loadChildren: () =>
      import('./routes/designer/designer-routing.module').then(
        (m) => m.DesignerRoutingModule
      ),
  },
  {
    path: 'preview',
    loadChildren: () =>
      import('./routes/preview/preview-routing.module').then(
        (m) => m.PreviewRoutingModule
      ),
  },
  {
    path: 'demo',
    loadChildren: () =>
      import('./routes/demo/demo-routing.module').then(
        (m) => m.DemoRoutingModule
      ),
  },
  {
    path: '',
    redirectTo: 'demo',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'passport',
  },
];
