import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Constants, ErrorMessageConstants } from 'src/app/shared/constants/constants';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageDialogService } from 'src/app/services/message-dialog.service';
import { DialogService } from '@tomblue/ng2-bootstrap-modal';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ApicallService } from '../../../services/apicall.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent implements OnInit {

  public saleFormGroup: FormGroup;
  public EditModeOn: boolean = false;
  public params: any = {};
  public SaleIdentifier = 0;
  public SaleDetail: any = {};
  public saleFormErrorObject: any = {};
  public VendorIdVal = 0;
  public VendorNameVal = '';
  public ProductIdVal = 0;
  public ProductNameVal = '';
  public UomVal = '';
  public SaleDateError: boolean = false;
  public SaleDateErrorMessage = '';
  public vendors = [];
  public products = [];
  public _lstUom = [{ 'Val': '', 'Name': 'Select UOM' }, { 'Val': 'KG', 'Name': 'KG' },
  { 'Val': 'GRAM', 'Name': 'GRAM' }, { 'Val': 'PCS', 'Name': 'PCS' }];

  public salesprdlist = [];
  public IsSaleProductupdateCall: boolean = false;
  public oldSaleProduct: any = {};
  public array: any;
  public pageNo = 0;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public TotalProductSalesAmount = 0;
  displayedColumns: string[] = ['prdname', 'qty', 'uom', 'salerate', 'totalamt', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  get SaleDate() {
    return this.saleFormGroup.get('SaleDate');
  }
  get VendorId() {
    return this.saleFormGroup.get('VendorId');
  }
  get VendorNumber() {
    return this.saleFormGroup.get('VendorNumber');
  }
  get VendorLocation() {
    return this.saleFormGroup.get('VendorLocation');
  }
  get VendorSegment() {
    return this.saleFormGroup.get('VendorSegment');
  }
  get ProductId() {
    return this.saleFormGroup.get('ProductId');
  }
  get Quantity() {
    return this.saleFormGroup.get('Quantity');
  }
  get UOM() {
    return this.saleFormGroup.get('UOM');
  }
  get SaleRate() {
    return this.saleFormGroup.get('SaleRate');
  }
  get TotalAmount() {
    return this.saleFormGroup.get('TotalAmount');
  }
  get GST() {
    return this.saleFormGroup.get('GST');
  }
  get TotalBill() {
    return this.saleFormGroup.get('TotalBill');
  }
  get AmountPaid() {
    return this.saleFormGroup.get('AmountPaid');
  }
  get AmountPending() {
    return this.saleFormGroup.get('AmountPending');
  }
  get PaymentCycle() {
    return this.saleFormGroup.get('PaymentCycle');
  }
  get Remark() {
    return this.saleFormGroup.get('Remark');
  }
  get pf() {
    return this.saleFormGroup.controls;
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
  }

  constructor(private _location: Location,
    private formbuilder: FormBuilder,
    private injector: Injector,
    private _dialogService: DialogService,
    private uiLoader: NgxUiLoaderService,
    private _messageDialogService: MessageDialogService,
    private router: Router,
    private _http: HttpClient,
    private localstorageservice: LocalStorageService,
    private apicallservice: ApicallService) {

    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('/sales')) {
          //set passing parameters to localstorage.
          if (localStorage.getItem('saleEditRouteparams')) {
            this.params = JSON.parse(localStorage.getItem('saleEditRouteparams'));
            this.SaleIdentifier = this.params.Routeparams.passingparams.Identifier
          }
        }
        else {
          localStorage.removeItem("saleEditRouteparams");
        }
      }
    });
  }

  ngOnInit() {

    //Validations for procurement Form.
    this.saleFormGroup = this.formbuilder.group({
      SaleDate: [null, Validators.compose([Validators.required])],
      VendorId: [0, Validators.compose([Validators.required])],
      VendorNumber: [null, Validators.compose([Validators.required])],
      VendorLocation: [null, Validators.compose([Validators.required])],
      VendorSegment: [null, Validators.compose([Validators.required])],
      ProductId: [0, Validators.compose([Validators.required])],
      Quantity: [null, Validators.compose([Validators.required, Validators.min(1), Validators.pattern(Constants.onlyNumbersWithDot)])],
      UOM: ['', Validators.compose([Validators.required])],
      SaleRate: [null, Validators.compose([Validators.required, Validators.min(1), Validators.pattern(Constants.onlyNumbersWithDot)])],
      TotalAmount: [null, Validators.compose([Validators.required, Validators.pattern(Constants.onlyNumbersWithDot)])],
      GST: [null, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(Constants.onlyNumbersWithDot)])],
      TotalBill: [null, Validators.compose([Validators.required, Validators.pattern(Constants.onlyNumbersWithDot)])],
      AmountPaid: [null, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(Constants.onlyNumbersWithDot)])],
      AmountPending: [null, Validators.compose([Validators.required, Validators.pattern(Constants.onlyNumbersWithDot)])],
      PaymentCycle: [''],
      Remark: ['', Validators.compose([Validators.maxLength(500)])],
    });

    this.getVendors(null);

    this.dataSource = new MatTableDataSource<any>(this.salesprdlist);
    this.dataSource.sort = this.sort;
    this.array = this.salesprdlist;
  }

  editRecord(e: any) {
    var list = this.salesprdlist.filter(i => i.ProductId == e.ProductId);
    if(list.length > 0) {
      this.saleFormGroup.controls['ProductId'].setValue(list[0].ProductId);
      this.saleFormGroup.controls['Quantity'].setValue(list[0].Quantity);
      this.saleFormGroup.controls['UOM'].setValue(list[0].UOM);
      this.saleFormGroup.controls['SaleRate'].setValue(list[0].Rate);

      this.ProductIdVal = list[0].ProductId;
      this.ProductNameVal = list[0].ProductName;
      this.UomVal = list[0].UOM;

      this.IsSaleProductupdateCall = true;
      this.oldSaleProduct = list[0];
      this.deleteRecord(list[0]);
    }
  }

  deleteRecord(e: any) {
    const index: number = this.salesprdlist.indexOf(e);
    if (index !== -1) {
        this.salesprdlist.splice(index, 1);
        this.dataSource = new MatTableDataSource<any>(this.salesprdlist);
        this.dataSource.sort = this.sort;
        this.array = this.salesprdlist;
    }
    this.TotalProductSalesAmount = this.TotalProductSalesAmount - e.TotalAmount;

    this.saleFormGroup.patchValue({ TotalAmount: this.TotalProductSalesAmount });

    if (this.saleFormGroup.value.GST != null && this.saleFormGroup.value.GST > 0) {
      this.saleFormGroup.patchValue({ TotalBill: this.saleFormGroup.value.TotalAmount + 
        ((this.saleFormGroup.value.TotalAmount * this.saleFormGroup.value.GST) / 100) });
    }
    
    if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
      this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
    }

  }

  clearAddSaleProduct() {
    this.addSalePrd(this.oldSaleProduct);
  }

  addSaleProduct() {

    if(!this.validSaleProductAddForm()) {

      if(this.IsSaleProductupdateCall) {
        var list = this.salesprdlist.filter(i => i.ProductId == this.ProductIdVal);
        if(list.length == 0) {
          const index: number = this.salesprdlist.indexOf(this.oldSaleProduct);
          if (index !== -1) {
            this.salesprdlist.splice(index, 1);
          }

          this.oldSaleProduct = {};
          this.addSalePrd(this.setSaleProductData());
        }else {
          this._messageDialogService.openDialogBox('Error', "Record already added", Constants.msgBoxError);
        }
      }else {
        var list = this.salesprdlist.filter(i => i.ProductId == this.ProductIdVal);
        if(list.length == 0) {
          this.addSalePrd(this.setSaleProductData());
        }else {
          this._messageDialogService.openDialogBox('Error', "Record already added", Constants.msgBoxError);
        }
      }

    }    
  }

  setSaleProductData() {
    var object: any = {};
    object.ProductId = this.ProductIdVal;
    object.ProductName = this.ProductNameVal;
    object.Quantity = this.saleFormGroup.value.Quantity;
    object.UOM = this.UomVal;
    object.Rate = this.saleFormGroup.value.SaleRate;
    object.TotalAmount = (this.saleFormGroup.value.Quantity * this.saleFormGroup.value.SaleRate);
    return object;
  }

  addSalePrd(salePrd: any) {

    if(salePrd.ProductId != undefined) {
      this.TotalProductSalesAmount = 0;
      this.salesprdlist.push(salePrd);

      this.dataSource = new MatTableDataSource<any>(this.salesprdlist);
      this.dataSource.sort = this.sort;
      this.array = this.salesprdlist;

      this.salesprdlist.forEach(i => {
        this.TotalProductSalesAmount = this.TotalProductSalesAmount + i.TotalAmount;
      });

      this.saleFormGroup.patchValue({ TotalAmount: this.TotalProductSalesAmount });

      if (this.saleFormGroup.value.GST != null && this.saleFormGroup.value.GST > 0) {
        this.saleFormGroup.patchValue({ TotalBill: this.saleFormGroup.value.TotalAmount + 
          ((this.saleFormGroup.value.TotalAmount * this.saleFormGroup.value.GST) / 100) });
      }
      
      if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
        this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
      }
    }

    this.ProductIdVal = 0;
    this.ProductNameVal = '';
    this.UomVal = '',

    this.saleFormGroup.controls['ProductId'].setValue(0);
    this.saleFormGroup.controls['Quantity'].setValue(null);
    this.saleFormGroup.controls['UOM'].setValue('');
    this.saleFormGroup.controls['SaleRate'].setValue(null);
  
    this.saleFormGroup.controls['Quantity'].markAsUntouched();
    this.saleFormGroup.controls['SaleRate'].markAsUntouched();
  }

  validSaleProductAddForm() {
    if (this.ProductIdVal == 0) {
      return true;
    }
    if (this.saleFormGroup.controls.Quantity.invalid) {
      return true;
    }
    if (this.UomVal == '') {
      return true;
    }
    if (this.saleFormGroup.controls.SaleRate.invalid) {
      return true;
    }
    return false;
  }


  async getVendors(searchParameter) {
    this.vendors = [{ "Identifier": 0, "Name": "Select Vendor" }];
    if (searchParameter == null) {
      searchParameter = {};
      searchParameter.IsActive = true;
      searchParameter.PagingParameter = {};
      searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
      searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
      searchParameter.SortParameter = {};
      searchParameter.SortParameter.SortColumn = Constants.Name;
      searchParameter.SortParameter.SortOrder = Constants.Ascending;
      searchParameter.SearchMode = Constants.Contains;
    }
    var response = await this.apicallservice.getVendors(searchParameter);
    let _lst = response.list;
    this.vendors = [...this.vendors, ..._lst];
    this.getProducts(null);
  }

  async getProducts(searchParameter) {
    this.products = [{ "Identifier": 0, "ProductName": "Select Product" }];
    if (searchParameter == null) {
      searchParameter = {};
      searchParameter.IsActive = true;
      searchParameter.PagingParameter = {};
      searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
      searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
      searchParameter.SortParameter = {};
      searchParameter.SortParameter.SortColumn = "id";
      searchParameter.SortParameter.SortOrder = Constants.Ascending;
      searchParameter.SearchMode = Constants.Contains;
    }
    var response = await this.apicallservice.getProducts(searchParameter);
    let _lst = response.list;
    this.products = [...this.products, ..._lst];

    if (this.SaleIdentifier > 0) {
      this.getSaleDetails();
      this.EditModeOn = true;
    }
  }

  async getSaleDetails() {

    let searchParameter: any = {};
    searchParameter.IsSaleProductListRequired = true;
    searchParameter.Identifier = this.SaleIdentifier;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = 'id';
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Exact;

    var response = await this.apicallservice.getSales(searchParameter);
    if (response != null && response.list != null && response.list.length > 0) {
      this.SaleDetail = response.list[0];
      this.saleFormGroup.patchValue({
        SaleDate: this.SaleDetail.SaleDate,
        VendorId: this.SaleDetail.VendorId,
        VendorNumber: this.SaleDetail.VendorNumber,
        VendorLocation: this.SaleDetail.Location,
        VendorSegment: this.SaleDetail.Segment,
        TotalAmount: this.SaleDetail.TotalAmount,
        GST: this.SaleDetail.GST,
        TotalBill: this.SaleDetail.TotalBillAmount,
        AmountPaid: this.SaleDetail.AmountPaid,
        AmountPending: this.SaleDetail.AmountPending,
        PaymentCycle: this.SaleDetail.PaymentCycle,
        Remark: this.SaleDetail.Remark,
      });

      this.salesprdlist = this.SaleDetail.SaleProducts;
      this.dataSource = new MatTableDataSource<any>(this.salesprdlist);
      this.dataSource.sort = this.sort;
      this.array = this.salesprdlist;

      this.salesprdlist.forEach(i => {
        this.TotalProductSalesAmount = this.TotalProductSalesAmount + i.TotalAmount;
      });

      this.VendorIdVal = this.SaleDetail.VendorId;
      this.VendorNameVal = this.SaleDetail.VendorName;
      this.ProductIdVal = this.SaleDetail.ProductId;
      this.ProductNameVal = this.SaleDetail.ProductName;
      this.UomVal = this.SaleDetail.UOM;
      this.SaleIdentifier = this.SaleDetail.Identifier;
    }

  }

  onVendorSelected(event) {
    const value = event.target.value;
    if (value == "0") {
      this.saleFormErrorObject.vendorShowError = true;
      this.VendorIdVal = 0;
      this.VendorNameVal = '';

      this.saleFormGroup.patchValue({ 
        VendorNumber: null,
        VendorLocation: null,
        VendorSegment: null, 
      });
    }
    else {
      this.saleFormErrorObject.vendorShowError = false;
      this.VendorIdVal = Number(value);
      this.VendorNameVal = this.vendors.filter(it => it.Identifier == this.VendorIdVal)[0].Name;
      let vr = this.vendors.filter(it => it.Identifier == this.VendorIdVal)[0];
      this.saleFormGroup.patchValue({ 
        VendorNumber: vr.VendorCode,
        VendorLocation: vr.Location,
        VendorSegment: vr.Segment, 
      });
    }
  }

  onProductSelected(event) {
    const value = event.target.value;
    if (value == "0") {
      this.saleFormErrorObject.productShowError = true;
      this.ProductIdVal = 0;
      this.ProductNameVal = '';
    }
    else {
      this.saleFormErrorObject.productShowError = false;
      this.ProductIdVal = Number(value);
      this.ProductNameVal = this.products.filter(it => it.Identifier == this.ProductIdVal)[0].ProductName;
    }
  }

  onUomSelected(event) {
    const value = event.target.value;
    if (value == '') {
      this.saleFormErrorObject.UOMShowError = true;
      this.UomVal = '';
    }
    else {
      this.saleFormErrorObject.UOMShowError = false;
      this.UomVal = value;
    }
  }

  onQuantityValueChange() {

    this.saleFormGroup.patchValue({ TotalAmount: null });
    this.saleFormGroup.patchValue({ TotalBill: null });
    this.saleFormGroup.patchValue({ AmountPending: null });

    if (this.saleFormGroup.value.Quantity != null && this.saleFormGroup.value.Quantity > 0) {
      if (this.saleFormGroup.value.SaleRate != null && this.saleFormGroup.value.SaleRate > 0) {
        
        this.saleFormGroup.patchValue({ TotalAmount: this.saleFormGroup.value.Quantity * this.saleFormGroup.value.SaleRate });

        if (this.saleFormGroup.value.GST != null && this.saleFormGroup.value.GST > 0) {
          this.saleFormGroup.patchValue({ TotalBill: this.saleFormGroup.value.TotalAmount + 
            ((this.saleFormGroup.value.TotalAmount * this.saleFormGroup.value.GST) / 100) });
        }
        
        if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
          this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
        }
      }
    }
  }

  onSaleRateValueChange() {

    this.saleFormGroup.patchValue({ TotalAmount: null });
    this.saleFormGroup.patchValue({ TotalBill: null });
    this.saleFormGroup.patchValue({ AmountPending: null });

    if (this.saleFormGroup.value.SaleRate != null && this.saleFormGroup.value.SaleRate > 0) {
      if (this.saleFormGroup.value.Quantity != null && this.saleFormGroup.value.Quantity > 0) {
        
        this.saleFormGroup.patchValue({ TotalAmount: this.saleFormGroup.value.Quantity * this.saleFormGroup.value.SaleRate });

        if (this.saleFormGroup.value.GST != null && this.saleFormGroup.value.GST > 0) {
          this.saleFormGroup.patchValue({ TotalBill: this.saleFormGroup.value.TotalAmount + 
            ((this.saleFormGroup.value.TotalAmount * this.saleFormGroup.value.GST) / 100) });
        }

        if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
          this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
        }
      }
    }
  }

  onTotalAmountValueChange() {

    this.saleFormGroup.patchValue({ TotalBill: null });
    this.saleFormGroup.patchValue({ AmountPending: null });
    
    if (this.saleFormGroup.value.TotalAmount != null && this.saleFormGroup.value.TotalAmount > 0) {
      if (this.saleFormGroup.value.GST != null && this.saleFormGroup.value.GST >= 0) {
        
        this.saleFormGroup.patchValue({ TotalBill: this.saleFormGroup.value.TotalAmount + 
          ((this.saleFormGroup.value.TotalAmount * this.saleFormGroup.value.GST) / 100) });

        if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
          this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
        }
      } 
    } 
  }

  onGstValueChange() {

    this.saleFormGroup.patchValue({ TotalBill: null });
    this.saleFormGroup.patchValue({ AmountPending: null });

    if (this.saleFormGroup.value.GST != null && this.saleFormGroup.value.GST >= 0) {
      if (this.saleFormGroup.value.TotalAmount != null && this.saleFormGroup.value.TotalAmount > 0) {
        
        this.saleFormGroup.patchValue({ TotalBill: this.saleFormGroup.value.TotalAmount + 
          ((this.saleFormGroup.value.TotalAmount * this.saleFormGroup.value.GST) / 100) });
        
        if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
          this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
        }
      }
    }
  }

  onTotalBillValueChange() {

    this.saleFormGroup.patchValue({ AmountPending: null });

    if (this.saleFormGroup.value.TotalBill != null && this.saleFormGroup.value.TotalBill > 0) {
      if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
        this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
      } 
    }
  }

  onAmountPaidValueChange() {

    this.saleFormGroup.patchValue({ AmountPending: null });

    if (this.saleFormGroup.value.AmountPaid != null && this.saleFormGroup.value.AmountPaid > 0) {
      if (this.saleFormGroup.value.TotalBill != null && this.saleFormGroup.value.TotalBill > 0) {
        this.saleFormGroup.patchValue({ AmountPending: this.saleFormGroup.value.TotalBill - this.saleFormGroup.value.AmountPaid });
      } 
    }
  }

  onSaleDateChange(event) {
    if (this.saleFormGroup.value.SaleDate != null && this.saleFormGroup.value.SaleDate != '') {
      let saleDte = this.saleFormGroup.value.SaleDate;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (saleDte.getTime() < today.getTime()) {
        this.SaleDateError = true;
        this.SaleDateErrorMessage = ErrorMessageConstants.getProcurementDateLessThanCurrentDateMessage;
      } else {
        this.SaleDateError = false;
        this.SaleDateErrorMessage = '';
      }
    }
  }

  saveBtnValidation(): boolean {
    if (this.SaleDateError || this.saleFormGroup.value.SaleDate == null) {
      return true;
    }
    if (this.VendorIdVal == 0) {
      return true;
    }
    // if (this.ProductIdVal == 0) {
    //   return true;
    // }
    // if (this.saleFormGroup.controls.Quantity.invalid) {
    //   return true;
    // }
    // if (this.UomVal == '') {
    //   return true;
    // }
    // if (this.saleFormGroup.controls.SaleRate.invalid) {
    //   return true;
    // }
    if (this.saleFormGroup.controls.TotalAmount.invalid) {
      return true;
    }
    if (this.saleFormGroup.controls.GST.invalid) {
      return true;
    }
    if (this.saleFormGroup.controls.TotalBill.invalid) {
      return true;
    }
    if (this.saleFormGroup.controls.AmountPaid.invalid) {
      return true;
    }
    if (this.saleFormGroup.controls.AmountPending.invalid) {
      return true;
    }
    if (this.saleFormGroup.controls.Remark.invalid) {
      return true;
    }
    return false;
  }

  OnCancelBtnClicked() {
    const router = this.injector.get(Router);
    router.navigate(['sales']);
  }

  OnSaveBtnClicked() {
    let sale: any = {};
    sale.SaleDate = this.saleFormGroup.value.SaleDate;
    sale.VendorId = this.VendorIdVal;
    sale.VendorNumber = this.saleFormGroup.value.VendorNumber;
    sale.VendorName = this.VendorNameVal;
    sale.Location = this.saleFormGroup.value.VendorLocation;
    sale.Segment = this.saleFormGroup.value.VendorSegment;
    sale.Rate = this.saleFormGroup.value.SaleRate;
    sale.GST = this.saleFormGroup.value.GST;
    sale.TotalAmount = this.saleFormGroup.value.TotalAmount;
    sale.TotalBillAmount = this.saleFormGroup.value.TotalBill;
    sale.AmountPaid = this.saleFormGroup.value.AmountPaid;
    sale.PendingAmount = this.saleFormGroup.value.AmountPending;
    sale.PaymentCycle = this.saleFormGroup.value.PaymentCycle;
    sale.Remark = this.saleFormGroup.value.Remark;
    sale.SaleProducts = this.salesprdlist;

    if (this.EditModeOn) {
      sale.Identifier = this.SaleIdentifier;
    }
    this.SaveSaleDetails(sale);
  }

  async SaveSaleDetails(sale) {
    let data = [];
    data.push(sale);
    let isRecordSaved = await this.apicallservice.saveSales(data, this.EditModeOn);
    this.uiLoader.stop();
    if (isRecordSaved) {
      let message = Constants.recordAddedMessage;
      if (this.EditModeOn) {
        message = Constants.recordUpdatedMessage;
        localStorage.removeItem("saleEditRouteparams");
      }

      this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
      const router = this.injector.get(Router);
      router.navigate(['sales']);
    }
  }

}
