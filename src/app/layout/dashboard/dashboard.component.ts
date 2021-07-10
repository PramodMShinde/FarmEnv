import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageDialogService } from '../../services/message-dialog.service';
import { Constants } from '../../shared/constants/constants';
import { ApicallService } from '../../services/apicall.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public filterProcurementFormGroup: FormGroup;
  public filterFarmerFormGroup: FormGroup;
  public filterVendorFormGroup: FormGroup;

  public ProcurementDatalist: any[] = [];
  public sorteddProcurementDataList: any[] = [];
  public procurementPageNo = 0;
  public procurementPageSize = 5;
  public currentProcurementPage = 0;
  public totalProcurementDataSize = 0;
  public procurementArray: any;
  public totalProcurementRecordCount = 0;
  public ProcurementFooterTableData: any = {};

  public FarmerDatalist: any[] = [];
  public sorteddFarmerDatalistList: any[] = [];
  public farmerPageNo = 0;
  public farmerPageSize = 5;
  public currentFarmerPage = 0;
  public totalFarmerDataSize = 0;
  public farmerArray: any;
  public totalFarmerRecordCount = 0;
  public FarmerFooterTableData: any = {};

  public VendorDatalist: any[] = [];
  public sorteddVendorDatalistList: any[] = [];
  public vendorPageNo = 0;
  public vendorPageSize = 5;
  public currentVendorPage = 0;
  public totalVendorDataSize = 0;
  public vendorArray: any;
  public totalVendorRecordCount = 0;
  public VendorFooterTableData: any = {};

  public sortOrder = Constants.Descending;
  public sortColumn = 'id';
  public DataFormat = '';

  displayedProcurementColumns: string[] = ['date', 'productname', 'procureQty', 'procureAmt', 'saleQty', 'saleAmt'];
  ProcurementDataSource = new MatTableDataSource<any>();

  displayedFarmerColumns: string[] = ['date','farmername', 'totalAmt', 'amtPaid', 'amtPending'];
  FarmerDataSource = new MatTableDataSource<any>();

  displayedVendorColumns: string[] = ['date','vendorname', 'vendorcode', 'totalAmt', 'amtPaid', 'amtPending'];
  VendorDataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private injector: Injector,
    private fb: FormBuilder,
    private uiLoader: NgxUiLoaderService,
    private _messageDialogService: MessageDialogService,
    private route: Router,
    private apicallservice: ApicallService) {
      this.sorteddProcurementDataList = this.sorteddProcurementDataList.slice();
      this.sorteddFarmerDatalistList = this.sorteddFarmerDatalistList.slice();
      this.sorteddVendorDatalistList = this.sorteddVendorDatalistList.slice();
    }

  get FilterProcurementDate() {
    return this.filterProcurementFormGroup.get('FilterProcurementDate');
  }

  get FilterFarmerName() {
    return this.filterFarmerFormGroup.get('FilterFarmerName');
  }

  get FilterVendorName() {
    return this.filterVendorFormGroup.get('FilterVendorName');
  }

  ngOnInit() {
    this.DataFormat = localStorage.getItem('DateFormat');

    //Validations for fitler procurement Form.
    this.filterProcurementFormGroup = this.fb.group({
      FilterProcurementDate: [null],
    });

    //Validations for fitler former Form.
    this.filterFarmerFormGroup = this.fb.group({
      FilterFarmerName: [null],
    });

    //Validations for fitler vendor Form.
    this.filterVendorFormGroup = this.fb.group({
      FilterVendorName: [null],
    });

    this.getProductwiseProductmentAndSaleDetails(null);
    this.getFarmerPaymentDetails(null);
    this.getVendorPaymentDetails(null);
  }

  public handleProcurementPage(e: any) {
    this.currentProcurementPage = e.pageIndex;
    this.procurementPageSize = e.pageSize;
    this.getProductwiseProductmentAndSaleDetails(null);
  }

  public handleFarmerPage(e: any) {
    this.currentFarmerPage = e.pageIndex;
    this.farmerPageSize = e.pageSize;
    this.getFarmerPaymentDetails(null);
  }

  public handleVendorPage(e: any) {
    this.currentVendorPage = e.pageIndex;
    this.vendorPageSize = e.pageSize;
    this.getVendorPaymentDetails(null);
  }

  async getProductwiseProductmentAndSaleDetails(searchParameter) {
    if (searchParameter == null) {
      searchParameter = {};
      searchParameter.PagingParameter = {};
      searchParameter.PagingParameter.PageIndex = this.currentProcurementPage + 1;
      searchParameter.PagingParameter.PageSize = this.procurementPageSize;
      searchParameter.SearchMode = Constants.Contains;
    }

    var response = await this.apicallservice.GetProductwiseProcurementVsSaleDetails(searchParameter);
    this.ProcurementDatalist = response.list;
    this.totalProcurementRecordCount = response.RecordCount;
    
    this.ProcurementDataSource = new MatTableDataSource<any>(this.ProcurementDatalist);
    this.ProcurementDataSource.sort = this.sort;
    this.procurementArray = this.ProcurementDatalist;
    this.totalProcurementDataSize = this.totalProcurementRecordCount;

    if(this.ProcurementDatalist.length > 0) {
      this.ProcurementFooterTableData.Name = 'Total';
      this.ProcurementFooterTableData.TotalProcurementQty = this.ProcurementDatalist.map(item => item.ProcurementQuantity).reduce((prev, next) => prev + next);
      this.ProcurementFooterTableData.TotalProcurementAmt = this.ProcurementDatalist.map(item => item.ProcurementTotalAmount).reduce((prev, next) => prev + next);
      this.ProcurementFooterTableData.TotalSaleQty = this.ProcurementDatalist.map(item => item.SaleQuantity).reduce((prev, next) => prev + next);
      this.ProcurementFooterTableData.TotalSaleAmt = this.ProcurementDatalist.map(item => item.SaleTotalAmount).reduce((prev, next) => prev + next);
    } 
  }

  async getFarmerPaymentDetails(searchParameter) {
    if (searchParameter == null) {
      searchParameter = {};
      searchParameter.PagingParameter = {};
      searchParameter.PagingParameter.PageIndex = this.currentFarmerPage + 1;
      searchParameter.PagingParameter.PageSize = this.farmerPageSize;
      searchParameter.SearchMode = Constants.Contains;
    }

    var response = await this.apicallservice.GetFarmerPaymentDetails(searchParameter);
    this.FarmerDatalist = response.list;
    this.totalFarmerRecordCount = response.RecordCount;
    
    this.FarmerDataSource = new MatTableDataSource<any>(this.FarmerDatalist);
    this.FarmerDataSource.sort = this.sort;
    this.farmerArray = this.FarmerDatalist;
    this.totalFarmerDataSize = this.totalFarmerRecordCount;

    if(this.FarmerDatalist.length > 0) {
      this.FarmerFooterTableData.Name = 'Total';
      this.FarmerFooterTableData.TotalAmount = this.FarmerDatalist.map(item => item.TotalAmount).reduce((prev, next) => prev + next);
      this.FarmerFooterTableData.TotalAmountPaid = this.FarmerDatalist.map(item => item.AmountPaid).reduce((prev, next) => prev + next);
      this.FarmerFooterTableData.TotalAmountPending = this.FarmerDatalist.map(item => item.PendingAmount).reduce((prev, next) => prev + next);
    }
  }

  async getVendorPaymentDetails(searchParameter) {
    if (searchParameter == null) {
      searchParameter = {};
      searchParameter.PagingParameter = {};
      searchParameter.PagingParameter.PageIndex = this.currentFarmerPage + 1;
      searchParameter.PagingParameter.PageSize = this.farmerPageSize;
      searchParameter.SearchMode = Constants.Contains;
    }

    var response = await this.apicallservice.GetVendorPaymentDetails(searchParameter);
    this.VendorDatalist = response.list;
    this.totalVendorRecordCount = response.RecordCount;
    
    this.VendorDataSource = new MatTableDataSource<any>(this.VendorDatalist);
    this.VendorDataSource.sort = this.sort;
    this.vendorArray = this.VendorDatalist;
    this.totalVendorDataSize = this.totalVendorRecordCount;

    if(this.VendorDatalist.length > 0) {
      this.VendorFooterTableData.Name = 'Total';
      this.VendorFooterTableData.TotalAmount = this.VendorDatalist.map(item => item.TotalAmount).reduce((prev, next) => prev + next);
      this.VendorFooterTableData.TotalAmountPaid = this.VendorDatalist.map(item => item.AmountPaid).reduce((prev, next) => prev + next);
      this.VendorFooterTableData.TotalAmountPending = this.VendorDatalist.map(item => item.PendingAmount).reduce((prev, next) => prev + next);
    }
  }

  onFilterProcurementDateChange(event){
    let searchParameter: any = {};
    searchParameter.FilterDate = this.filterProcurementFormGroup.value.FilterProcurementDate;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentProcurementPage + 1;
    searchParameter.PagingParameter.PageSize = this.procurementPageSize;
    searchParameter.SearchMode = Constants.Contains;
    this.getProductwiseProductmentAndSaleDetails(searchParameter);
  }

  onFilterFarmerNameValChange(){
    let searchParameter: any = {};
    searchParameter.FarmerName = this.filterFarmerFormGroup.value.FilterFarmerName;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentProcurementPage + 1;
    searchParameter.PagingParameter.PageSize = this.procurementPageSize;
    searchParameter.SearchMode = Constants.Contains;
    this.getFarmerPaymentDetails(searchParameter);
  }

  onFilterVendorNameValChange(){
    let searchParameter: any = {};
    searchParameter.VendorName = this.filterVendorFormGroup.value.FilterVendorName;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentProcurementPage + 1;
    searchParameter.PagingParameter.PageSize = this.procurementPageSize;
    searchParameter.SearchMode = Constants.Contains;
    this.getVendorPaymentDetails(searchParameter);
  }

  OnResetBtnClicked(actionfor: string) {
    if(actionfor == 'Procurement') {
      this.filterProcurementFormGroup.setValue({FilterProcurementDate : null});
      this.getProductwiseProductmentAndSaleDetails(null);
    }else if(actionfor == 'Farmer') {
      this.filterFarmerFormGroup.setValue({ FilterFarmerName : null });
      this.getFarmerPaymentDetails(null);
    }else if(actionfor == 'Vendor') {
      this.filterVendorFormGroup.setValue({ FilterVendorName : null });
      this.getVendorPaymentDetails(null);
    }
  }

}
