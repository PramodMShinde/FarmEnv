import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ProcurmentModule } from './procurment/procurment.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfitandlossComponent } from './profitandloss/profitandloss.component';
import { InventoryModule } from './inventory/inventory.module';
import { SaleModule } from './sale/sale.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [LayoutComponent, DashboardComponent, ProfitandlossComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    ProcurmentModule,
    SharedModule,
    RouterModule,
    InventoryModule,
    SaleModule
  ]
})
export class LayoutModule { }
