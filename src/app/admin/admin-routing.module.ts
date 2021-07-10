import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'farmers', loadChildren: () => import('./farmer/farmer.module').then(m => m.FarmerModule) },
      { path: 'vendors', loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule) },
      { path: 'products', component: ProductComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
