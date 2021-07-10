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

  displayedColumns: string[] = ['name', 'mobile', 'address', 'city', 'pincode', 'actions'];
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
      if (localStorage.getItem('farmerViewRouteparams')) {
        localStorage.removeItem('farmerViewRouteparams');
      }
      if (localStorage.getItem('farmerEditRouteparams')) {
        localStorage.removeItem('farmerEditRouteparams');
      }
    }

  get FilterFarmerName() {
    return this.filterFormGroup.get('FilterFarmerName');
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getFarmers(null);
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
      case 'name': this.sortColumn = "Name"; break;
      case 'mobile': this.sortColumn = "MobileNumber"; break;
      case 'address': this.sortColumn = "AddressLine1"; break;
      case 'city': this.sortColumn = "City"; break;
      case 'pincode': this.sortColumn = "Pincode"; break;
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
    this.getFarmers(searchParameter);
  }

  ngOnInit() {
    this.DataFormat = "dd/MM/yyyy";

    //Validations for fitler farmer Form.
    this.filterFormGroup = this.fb.group({
      FilterFarmerName: [null],
    });

    this.getFarmers(null);
  }

  async getFarmers(searchParameter) {
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
    var response = await apicallservice.getFarmers(searchParameter);
    this.datalist = response.list;
    this.totalRecordCount = response.RecordCount;
    
    this.dataSource = new MatTableDataSource<any>(this.datalist);
    this.dataSource.sort = this.sort;
    this.array = this.datalist;
    this.totalSize = this.totalRecordCount;
  }

  onFilterFarmerNameValChange(){
    let searchParameter: any = {};
    searchParameter.FarmerName = this.filterFormGroup.value.FilterFarmerName;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentPage + 1;
    searchParameter.PagingParameter.PageSize = this.pageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = this.sortColumn;
    searchParameter.SortParameter.SortOrder = this.sortOrder;
    searchParameter.SearchMode = Constants.Contains;
    this.getFarmers(searchParameter);
  }

  OnResetBtnClicked() {
    this.filterFormGroup.setValue( { FilterFarmerName: null });
    this.getFarmers(null);
  }

  navigationToViewRecord(farmer: any) {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": farmer.Identifier,
        }
      }
    }
    localStorage.setItem("farmerViewRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['farmers', 'View']);
  }

  navigationToEditRecord(farmer: any) {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": farmer.Identifier,
        }
      }
    }
    localStorage.setItem("farmerEditRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['farmers', 'Add']);
  }

  navigationToAddRecord() {
    const router = this.injector.get(Router);
    router.navigate(['farmers', 'Add']);
  }

  deleteRecord(farmer: any) {
    let message = 'Are you sure, you want to delete this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(farmer);
        let isDeleted = await this.apicallservice.deleteFarmer(data);
        if (isDeleted) {
          let messageString = Constants.recordDeletedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          this.getFarmers(null);
        }
      }
    });
  }

  deactivateRecord(farmer: any) {
    let message = 'Are you sure, you want to deactivate this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(farmer);
        let isDeleted = await this.apicallservice.deactivateFarmer(data);
        if (isDeleted) {
          let messageString = Constants.recordDeactivatedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          this.getFarmers(null);
        }
      }
    });
  }

  activateRecord(farmer: any) {
    let message = 'Are you sure, you want to activate this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(farmer);
        let isDeleted = await this.apicallservice.activateFarmer(data);
        if (isDeleted) {
          let messageString = Constants.recordActivatedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          this.getFarmers(null);
        }
      }
    });
  }
}
