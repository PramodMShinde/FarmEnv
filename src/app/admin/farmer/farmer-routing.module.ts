import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  {
    path: '',
    children: [
        { path: '', component: ListComponent },
        { path: 'list', component: ListComponent },
        { path: 'Add', component: AddComponent },
        { path: 'Edit', component: AddComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmerRoutingModule { }
