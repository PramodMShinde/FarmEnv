import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FarmerRoutingModule } from './farmer-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [
    CommonModule,
    FarmerRoutingModule,
    MatSortModule, MatTableModule, MatPaginatorModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class FarmerModule { }
