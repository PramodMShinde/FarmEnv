import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleRoutingModule } from './sale-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [AddComponent, ListComponent, ViewComponent],
  imports: [
    CommonModule,
    SaleRoutingModule,
    MatSortModule, MatTableModule, MatPaginatorModule,
    FormsModule, ReactiveFormsModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
  ]
})
export class SaleModule { }
