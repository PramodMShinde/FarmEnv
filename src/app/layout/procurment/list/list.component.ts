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

  public filterProcurmentFormGroup: FormGroup;
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

  displayedColumns: string[] = ['date', 'farmername', 'totalAmt', 'amtPaid', 'amtPending', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  constructor(private injector: Injector,
    private fb: FormBuilder,
    private uiLoader: NgxUiLoaderService,
    private _messageDialogService: MessageDialogService,
    private route: Router,
    private apicallservice: ApicallService) {
      this.sorteddataList = this.sorteddataList.slice();
      if (localStorage.getItem('procViewRouteparams')) {
        localStorage.removeItem('procViewRouteparams');
      }
      if (localStorage.getItem('procEditRouteparams')) {
        localStorage.removeItem('procEditRouteparams');
      }
    }

  get FilterProcurementDate() {
    return this.filterProcurmentFormGroup.get('FilterProcurementDate');
  }
  
  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getProductments(null);
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
      case 'date': this.sortColumn = "ProcurementDate"; break;
      case 'farmername': this.sortColumn = "FarmerName"; break;
      case 'productname': this.sortColumn = "ProductName"; break;
      case 'prdQty': this.sortColumn = "Quantity"; break;
      case 'rate': this.sortColumn = "ProcurmentRate"; break;
      case 'totalAmt': this.sortColumn = "TotalAmount"; break;
      case 'amtPaid': this.sortColumn = "AmountPaid"; break;
      case 'amtPending': this.sortColumn = "PendingAmount"; break;
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
    this.getProductments(searchParameter);
  }

  ngOnInit() {
    this.DataFormat = localStorage.getItem('DateFormat');

    //Validations for fitler procurement Form.
    this.filterProcurmentFormGroup = this.fb.group({
      FilterProcurementDate: [null],
    });

    this.getProductments(null);
  }

  async getProductments(searchParameter) {
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
    searchParameter.IsProcurementProductRequired = false;
    
    let apicallservice = this.injector.get(ApicallService);
    var response = await apicallservice.getProcurements(searchParameter);
    this.datalist = response.list;
    this.totalRecordCount = response.RecordCount;
    
    this.dataSource = new MatTableDataSource<any>(this.datalist);
    this.dataSource.sort = this.sort;
    this.array = this.datalist;
    this.totalSize = this.totalRecordCount;
  }

  navigationToViewRecord(proc: any) {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": proc.Identifier,
        }
      }
    }
    localStorage.setItem("procViewRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['procurment', 'View']);
  }

  navigationToEditRecord(proc: any) {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": proc.Identifier,
        }
      }
    }
    localStorage.setItem("procEditRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['procurment', 'Add']);
  }

  navigationToAddRecord() {
    const router = this.injector.get(Router);
    router.navigate(['procurment', 'Add']);
  }

  onFilterProcurementDateChange(event){
    let searchParameter: any = {};
    searchParameter.ProcurementDate = this.filterProcurmentFormGroup.value.FilterProcurementDate;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentPage + 1;
    searchParameter.PagingParameter.PageSize = this.pageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = this.sortColumn;
    searchParameter.SortParameter.SortOrder = this.sortOrder;
    searchParameter.SearchMode = Constants.Contains;
    this.getProductments(searchParameter);
  }

  OnResetBtnClicked() {
    this.filterProcurmentFormGroup.setValue({FilterProcurementDate : null});
    this.getProductments(null);
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
          this.getProductments(null);
        }
      }
    });
  }
}
