import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Week9Page } from './week9.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    component: Week9Page
  },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'insert',
    loadChildren: () => import('./insert/insert.module').then( m => m.InsertPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Week9PageRoutingModule {}
