import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'layout', loadChildren: () => import('../app/layout/layout.module').then(m => m.LayoutModule) },
    { path: 'admin', loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule) },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    providers: [
    ],
    exports: [RouterModule],
  })
  export class AppRoutingModule { }