import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignerLayoutComponent } from '@layout';
import {
  DesignerCodeComponent,
  DesignerDesktopComponent,
  DesignerPreviewComponent,
  DesignerSchemaComponent,
} from '@pages';

const routes: Routes = [
  {
    path: '',
    component: DesignerLayoutComponent,
    children: [
      {
        path: 'desktop',
        component: DesignerDesktopComponent,
      },
      {
        path: 'schema',
        component: DesignerSchemaComponent,
      },
      {
        path: 'code',
        component: DesignerCodeComponent,
      },
      {
        path: 'preview',
        component: DesignerPreviewComponent,
      },
      {
        path: '',
        redirectTo: 'desktop',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignerRoutingModule {}
