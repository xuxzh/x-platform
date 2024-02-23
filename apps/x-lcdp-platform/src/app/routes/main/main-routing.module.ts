import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HomePageComponent } from '@pages';
import { MainFrameComponent } from '@layout';

const routes: Route[] = [
  {
    path: '',
    component: MainFrameComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
