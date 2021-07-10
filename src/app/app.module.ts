import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LayoutModule } from './layout/layout.module';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { BootstrapModalModule } from '@tomblue/ng2-bootstrap-modal';
import { MessageComponent } from './shared/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule,
    LayoutModule, AdminModule, SharedModule, HttpClientModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule, 
    MatSortModule, MatTableModule, MatPaginatorModule,
    BootstrapModalModule.forRoot({ container: document.body }),
    NgxUiLoaderModule
  ],
  providers: [ NgxUiLoaderService ],
  bootstrap: [AppComponent],
  //Common component for alert message.
  entryComponents: [
    MessageComponent,
  ]
})
export class AppModule { }
