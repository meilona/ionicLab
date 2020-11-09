import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Week8Page } from './week8.page';

const routes: Routes = [
  {
    path: '',
    component: Week8Page
  },
  {
    path: 'students1',
    loadChildren: () => import('./students1/students1.module').then( m => m.Students1PageModule)
  },
  {
    path: 'students2',
    loadChildren: () => import('./students2/students2.module').then( m => m.Students2PageModule)
  },
  {
    path: 'students3',
    loadChildren: () => import('./students3/students3.module').then( m => m.Students3PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Week8PageRoutingModule {}
