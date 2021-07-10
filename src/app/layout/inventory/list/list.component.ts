import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Constants } from '../../../shared/constants/constants';
import { ApicallService } from '../../../services/apicall.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public filterFormGroup: FormGroup;
  public datalist: any[] = [];
  public sorteddataList: any[] = [];
  public pageNo = 0;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public array: any;
  public totalRecordCount = 0;
  public sortOrder = Constants.Descending;
  public sortColumn = 'id';
  public DataFormat = '';

  displayedColumns: string[] = ['productname', 'procQty', 'procUom', 'saleQty', 'saleUom', 'wastage', 'pendingQty', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  get FilterProductName() {
    return this.filterFormGroup.get('FilterProductName');
  }

  constructor(private injector: Injector,
    private fb: FormBuilder,
    private uiLoader: NgxUiLoaderService,
    private _messageDialogService: MessageDialogService,
    private route: Router,
    private apicallservice: ApicallService) {
      this.sorteddataList = this.sorteddataList.slice();
      if (localStorage.getItem('invViewRouteparams')) {
        localStorage.removeItem('invViewRouteparams');
      }
      if (localStorage.getItem('invEditRouteparams')) {
        localStorage.removeItem('invEditRouteparams');
      }
    }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getInventories(null);
  }

  sortData(sort: MatSort) {
    const data = this.datalist.slice();
    if (!sort.active || sort.direction === '') {
      this.sorteddataList = data;
      return;
    }

    if (sort.direction == 'asc') {
      this.sortOrder = Constants.Ascending;
    } else {
      this.sortOrder = Constants.Descending;
    }

    switch (sort.active) {
      case 'productname': this.sortColumn = "ProductName"; break;
      case 'procQty': this.sortColumn = "ProcurementQuantity"; break;
      case 'procUom': this.sortColumn = "ProcurementUOM"; break;
      case 'saleQty': this.sortColumn = "SaleQuantity"; break;
      case 'saleUom': this.sortColumn = "SaleUOM"; break;
      case 'wastage': this.sortColumn = "Wastage"; break;
      case 'pendingQty': this.sortColumn = "PendingQuantity"; break;
      default: this.sortColumn = "id"; break;
    }

    let searchParameter: any = {};
    searchParameter.IsActive = true;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentPage + 1;
    searchParameter.PagingParameter.PageSize = this.pageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = this.sortColumn;
    searchParameter.SortParameter.SortOrder = this.sortOrder;
    searchParameter.SearchMode = Constants.Contains;
    this.getInventories(searchParameter);
  }

  ngOnInit() {
    this.DataFormat = localStorage.getItem('DateFormat');

    //Validations for fitler inventory Form.
    this.filterFormGroup = this.fb.group({
      FilterProductName: [null],
    });

    this.getInventories(null);
  }

  async getInventories(searchParameter) {
    if (searchParameter == null) {
      searchParameter = {};
      searchParameter.PagingParameter = {};
      searchParameter.PagingParameter.PageIndex = this.currentPage + 1;
      searchParameter.PagingParameter.PageSize = this.pageSize;
      searchParameter.SortParameter = {};
      searchParameter.SortParameter.SortColumn = this.sortColumn;
      searchParameter.SortParameter.SortOrder = this.sortOrder;
      searchParameter.SearchMode = Constants.Contains;
    }

    let apicallservice = this.injector.get(ApicallService);
    var response = await apicallservice.getInventories(searchParameter);
    this.datalist = response.list;
    this.totalRecordCount = response.RecordCount;
    
    this.dataSource = new MatTableDataSource<any>(this.datalist);
    this.dataSource.sort = this.sort;
    this.array = this.datalist;
    this.totalSize = this.totalRecordCount;
  }

  onFilterProductNameValChange(){
    let searchParameter: any = {};
    searchParameter.ProductName = this.filterFormGroup.value.FilterProductName;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentPage + 1;
    searchParameter.PagingParameter.PageSize = this.pageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = this.sortColumn;
    searchParameter.SortParameter.SortOrder = this.sortOrder;
    searchParameter.SearchMode = Constants.Contains;
    this.getInventories(searchParameter);
  }

  OnResetBtnClicked() {
    this.filterFormGroup.setValue( { FilterProductName: null });
    this.getInventories(null);
  }

  navigationToViewRecord(proc: any) {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": proc.Identifier,
        }
      }
    }
    localStorage.setItem("invViewRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['inventory', 'View']);
  }

  navigationToEditRecord(proc: any) {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": proc.Identifier,
        }
      }
    }
    localStorage.setItem("invEditRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['inventory', 'Add']);
  }

  navigationToAddRecord() {
    const router = this.injector.get(Router);
    router.navigate(['inventory', 'Add']);
  }

  deleteRecord(proc: any) {
    let message = 'Are you sure, you want to delete this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(proc);
        let isDeleted = await this.apicallservice.deleteProcurment(data);
        if (isDeleted) {
          let messageString = Constants.recordDeletedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          this.getInventories(null);
        }
      }
    });
  }
}
