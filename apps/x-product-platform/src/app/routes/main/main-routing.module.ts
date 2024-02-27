import {
  Exception404Component,
  HomeComponent,
  UserManageComponent,
} from '@pages';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainFrameComponent } from '@layout';

const routes: Routes = [
  {
    path: '',
    component: MainFrameComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'UserManage',
        component: UserManageComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: Exception404Component,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
