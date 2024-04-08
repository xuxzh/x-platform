import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableDemoComponent } from '@pages';

const routes: Routes = [
  {
    path: 'table',
    component: TableDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule {}
