import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { ProfitandlossComponent } from './profitandloss/profitandloss.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'procurment', loadChildren: () => import('./procurment/procurment.module').then(m => m.ProcurmentModule) },
      { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule) },
      { path: 'sales', loadChildren: () => import('./sale/sale.module').then(m => m.SaleModule) },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profitandloss', component: ProfitandlossComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
