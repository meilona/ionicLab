import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full'
  },
  {
    path: 'week8',
    loadChildren: () => import('./week8/week8.module').then( m => m.Week8PageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then( m => m.ContactsPageModule)
  },
  {
    path: 'week9',
    loadChildren: () => import('./week9/week9.module').then( m => m.Week9PageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./week10/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./week10/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'edit/:key',
    loadChildren: () => import('./week10/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'display-map',
    loadChildren: () => import('./display-map/display-map.module').then( m => m.DisplayMapPageModule)
  },
  {
    path: 'current-loc',
    loadChildren: () => import('./current-loc/current-loc.module').then( m => m.CurrentLocPageModule)
  },
  {
    path: 'loc-coordinate',
    loadChildren: () => import('./loc-coordinate/loc-coordinate.module').then( m => m.LocCoordinatePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
