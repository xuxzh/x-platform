import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignerLayoutComponent } from '@layout';
import { DesignerDesktopComponent } from '@pages';

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
