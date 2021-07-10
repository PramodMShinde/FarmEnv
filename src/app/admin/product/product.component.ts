import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

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
  public Action = 'Add';

  public ProductId = 0;
  public AddEditProductFormGroup: FormGroup;
  public addEditProductContainer: boolean;

  displayedColumns: string[] = [ 'name', 'code', 'uom', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  get ProductName() {
    return this.AddEditProductFormGroup.get('ProductName');
  }

  get ProductUOM() {
    return this.AddEditProductFormGroup.get('ProductUOM');
  }

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
      if (localStorage.getItem('productViewRouteparams')) {
        localStorage.removeItem('productViewRouteparams');
      }
      if (localStorage.getItem('productEditRouteparams')) {
        localStorage.removeItem('productEditRouteparams');
      }
    }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getProducts(null);
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
      case 'name': this.sortColumn = "ProductName"; break;
      case 'uom': this.sortColumn = "UOM"; break;
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
    this.getProducts(searchParameter);
  }

  ngOnInit() {
    this.DataFormat = "dd/MM/yyyy";
    this.getProducts(null);

    //validations for the product add and edit form
    this.AddEditProductFormGroup = this.fb.group({
      ProductName: [null, Validators.compose([Validators.required,
      Validators.minLength(Constants.inputMinLenth), Validators.maxLength(Constants.inputMaxLenth),
        Validators.pattern(Constants.onlyCharacterswithInbetweenSpaceUpto50Characters)])
      ],
      ProductUOM: [null, Validators.compose([Validators.required,
      Validators.minLength(Constants.inputMinLenth), Validators.maxLength(Constants.inputMaxLenth),
        Validators.pattern(Constants.onlyLetters)])
      ]
    });

    //Validations for fitler product Form.
    this.filterFormGroup = this.fb.group({
      FilterProductName: [null],
    });
  }

  async getProducts(searchParameter) {
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
    var response = await apicallservice.getProducts(searchParameter);
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
    this.getProducts(searchParameter);
  }

  OnResetBtnClicked() {
    this.filterFormGroup.setValue( { FilterProductName: null });
    this.getProducts(null);
  }

  navigationToViewRecord(farmer: any) {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": farmer.Identifier,
        }
      }
    }
    localStorage.setItem("productViewRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['products', 'View']);
  }

  navigationToEditRecord(prd: any) {
    this.ProductId = prd.Identifier;
    this.addEditProductContainer = true;
    this.Action = 'Edit';
    this.AddEditProductFormGroup.controls['ProductName'].setValue(prd.ProductName);
    this.AddEditProductFormGroup.controls['ProductUOM'].setValue(prd.UOM);
  }

  navigationToAddRecord() {
    this.ProductId = 0;
    this.addEditProductContainer = true;
    this.Action = 'Add';
  }

  vaildateForm() {
    if (this.AddEditProductFormGroup.invalid) {
      return true;
    }
    return false;
  }

  CloseProductForm() {
    this.addEditProductContainer = false;
      this.AddEditProductFormGroup.controls['ProductName'].setValue('');
      this.AddEditProductFormGroup.controls['ProductUOM'].setValue('');
      this.AddEditProductFormGroup.reset();
  }

  async AddUpdateProduct() {
    var product: any = {};
    var isEditOperation = false;
    if(this.ProductId > 0) {
      isEditOperation = true;
      product = {
        "ProductName": this.AddEditProductFormGroup.value.ProductName,
        "UOM": this.AddEditProductFormGroup.value.ProductUOM,
        "Identifier": this.ProductId
      }
    }else {
      isEditOperation = false;
      product = {
        "ProductName": this.AddEditProductFormGroup.value.ProductName,
        "UOM": this.AddEditProductFormGroup.value.ProductUOM,
        "Identifier": 0
      }
    }

    var data = [];
    data.push(product);
    let isRecordSaved = await this.apicallservice.saveProduct(data, isEditOperation);
    if (isRecordSaved) {
      let message = Constants.recordAddedMessage;
      if (isEditOperation) {
        this.CloseProductForm();
        message = Constants.recordUpdatedMessage;
      }
      else {
        this.CloseProductForm();
      }
      this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
      this.getProducts(null);
    }
  }

  deleteRecord(product: any) {
    let message = 'Are you sure, you want to delete this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(product);
        let isDeleted = await this.apicallservice.deleteProduct(data);
        if (isDeleted) {
          let messageString = Constants.recordDeletedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          this.getProducts(null);
        }
      }
    });
  }

  deactivateRecord(product: any) {
    let message = 'Are you sure, you want to deactivate this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(product);
        let isDeleted = await this.apicallservice.deactivateProduct(data);
        if (isDeleted) {
          let messageString = Constants.recordDeactivatedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          this.getProducts(null);
        }
      }
    });
  }

  activateRecord(product: any) {
    let message = 'Are you sure, you want to activate this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(product);
        let isDeleted = await this.apicallservice.activateProduct(data);
        if (isDeleted) {
          let messageString = Constants.recordActivatedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          this.getProducts(null);
        }
      }
    });
  }
}
