import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DirectiveDemoComponent,
  TableDemoComponent,
  OnlyDemoComponent,
} from '@pages';

const routes: Routes = [
  {
    path: 'table',
    component: TableDemoComponent,
  },
  {
    path: 'directive',
    component: DirectiveDemoComponent,
  },
  {
    path: 'only',
    component: OnlyDemoComponent,
  },
  {
    path: '',
    redirectTo: 'directive',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule {}
