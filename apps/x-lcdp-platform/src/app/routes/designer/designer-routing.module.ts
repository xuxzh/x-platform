import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignerLayoutComponent } from '@layout';
import { DesignerComponent } from '@pages';

const routes: Routes = [
  {
    path: '',
    component: DesignerLayoutComponent,
    children: [
      {
        path: 'index',
        component: DesignerComponent,
      },
      {
        path: '',
        redirectTo: 'index',
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
