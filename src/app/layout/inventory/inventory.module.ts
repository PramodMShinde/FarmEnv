import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [ListComponent, AddComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MatSortModule, MatTableModule, MatPaginatorModule,
    FormsModule, ReactiveFormsModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
  ]
})
export class InventoryModule { }
