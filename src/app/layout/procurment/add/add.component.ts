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

  public procurementFormGroup: FormGroup;
  public EditModeOn: boolean = false;
  public params: any = {};
  public ProcurementIdentifier = 0;
  public ProcurementDetail: any = {};
  public procurementFormErrorObject: any = {};
  public FarmerIdVal = 0;
  public FarmerNameVal = '';
  public ProductIdVal = 0;
  public ProductNameVal = '';
  public UomVal = '';
  public ProcurmentDateError: boolean = false;
  public ProcurmentDateErrorMessage = '';
  public farmers = [];
  public products = [];
  
  public _lstUom = [{ 'Val': '', 'Name': 'Select UOM' }, { 'Val': 'KG', 'Name': 'KG' },
  { 'Val': 'GRAM', 'Name': 'GRAM' }, { 'Val': 'PCS', 'Name': 'PCS' }];

  public procurmentprdlist = [];
  public IsProcurementProductupdateCall: boolean = false;
  public oldProcurementProduct: any = {};
  public array: any;
  public pageNo = 0;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public TotalProductProcurementAmount = 0;
  displayedColumns: string[] = ['prdname', 'qty', 'uom', 'prdrate', 'totalamt', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  get ProcurementDate() {
    return this.procurementFormGroup.get('ProcurementDate');
  }
  get FarmerId() {
    return this.procurementFormGroup.get('FarmerId');
  }
  get ProductId() {
    return this.procurementFormGroup.get('ProductId');
  }
  get Quantity() {
    return this.procurementFormGroup.get('Quantity');
  }
  get UOM() {
    return this.procurementFormGroup.get('UOM');
  }
  get ProcurementRate() {
    return this.procurementFormGroup.get('ProcurementRate');
  }
  get TransportExpense() {
    return this.procurementFormGroup.get('TransportExpense');
  }
  get TotalAmount() {
    return this.procurementFormGroup.get('TotalAmount');
  }
  get AmountPaid() {
    return this.procurementFormGroup.get('AmountPaid');
  }
  get AmountPending() {
    return this.procurementFormGroup.get('AmountPending');
  }
  get PaymentCycle() {
    return this.procurementFormGroup.get('PaymentCycle');
  }
  get Remark() {
    return this.procurementFormGroup.get('Remark');
  }
  get pf() {
    return this.procurementFormGroup.controls;
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
        if (e.url.includes('/procurment')) {
          //set passing parameters to localstorage.
          if (localStorage.getItem('procEditRouteparams')) {
            this.params = JSON.parse(localStorage.getItem('procEditRouteparams'));
            this.ProcurementIdentifier = this.params.Routeparams.passingparams.Identifier
          }
        }
        else {
          localStorage.removeItem("procEditRouteparams");
        }
      }
    });
  }

  ngOnInit() {

    //Validations for procurement Form.
    this.procurementFormGroup = this.formbuilder.group({
      ProcurementDate: [null, Validators.compose([Validators.required])],
      FarmerId: [0, Validators.compose([Validators.required])],
      ProductId: [0, Validators.compose([Validators.required])],
      Quantity: [null, Validators.compose([Validators.required, Validators.min(1), Validators.pattern(Constants.onlyNumbersWithDot)])],
      UOM: ['', Validators.compose([Validators.required])],
      ProcurementRate: [null, Validators.compose([Validators.required, Validators.min(1), Validators.pattern(Constants.onlyNumbersWithDot)])],
      TransportExpense: [0, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(Constants.onlyNumbersWithDot)])],
      TotalAmount: [null, Validators.compose([Validators.required, Validators.pattern(Constants.onlyNumbersWithDot)])],
      AmountPaid: [null, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(Constants.onlyNumbersWithDot)])],
      AmountPending: [null, Validators.compose([Validators.required, Validators.pattern(Constants.onlyNumbersWithDot)])],
      PaymentCycle: [''],
      Remark: ['', Validators.compose([Validators.maxLength(500)])],
    });

    this.getFarmers(null);

    this.dataSource = new MatTableDataSource<any>(this.procurmentprdlist);
    this.dataSource.sort = this.sort;
    this.array = this.procurmentprdlist;
  }

  editRecord(e: any) {
    var list = this.procurmentprdlist.filter(i => i.ProductId == e.ProductId);
    if(list.length > 0) {
      this.procurementFormGroup.controls['ProductId'].setValue(list[0].ProductId);
      this.procurementFormGroup.controls['Quantity'].setValue(list[0].Quantity);
      this.procurementFormGroup.controls['UOM'].setValue(list[0].UOM);
      this.procurementFormGroup.controls['ProcurementRate'].setValue(list[0].Rate);

      this.ProductIdVal = list[0].ProductId;
      this.ProductNameVal = list[0].ProductName;
      this.UomVal = list[0].UOM;

      this.IsProcurementProductupdateCall = true;
      this.oldProcurementProduct = list[0];
      this.deleteRecord(list[0]);
    }
  }

  deleteRecord(e: any) {
    const index: number = this.procurmentprdlist.indexOf(e);
    if (index !== -1) {
        this.procurmentprdlist.splice(index, 1);
        this.dataSource = new MatTableDataSource<any>(this.procurmentprdlist);
        this.dataSource.sort = this.sort;
        this.array = this.procurmentprdlist;
    }
    this.TotalProductProcurementAmount = this.TotalProductProcurementAmount - e.TotalAmount;

    if (this.procurementFormGroup.value.TransportExpense != null) {
      this.procurementFormGroup.patchValue({
        TotalAmount: this.TotalProductProcurementAmount + this.procurementFormGroup.value.TransportExpense
      });
    }else {
      this.procurementFormGroup.patchValue({
        TotalAmount: this.TotalProductProcurementAmount
      });
    }

    if (this.procurementFormGroup.value.AmountPaid != null && this.procurementFormGroup.value.AmountPaid > 0) {
      this.procurementFormGroup.patchValue({
        AmountPending: this.procurementFormGroup.value.TotalAmount - this.procurementFormGroup.value.AmountPaid
      });
    } else {
      this.procurementFormGroup.patchValue({ AmountPending: null });
    }
  }

  clearAddProcurementProduct() {
    this.addProcurePrd(this.oldProcurementProduct);
  }

  addProcurementProduct() {

    if(!this.validProcurementProductAddForm()) {

      if(this.IsProcurementProductupdateCall) {
        var list = this.procurmentprdlist.filter(i => i.ProductId == this.ProductIdVal);
        if(list.length == 0) {
          const index: number = this.procurmentprdlist.indexOf(this.oldProcurementProduct);
          if (index !== -1) {
            this.procurmentprdlist.splice(index, 1);
          }
          this.oldProcurementProduct = {};
          this.addProcurePrd(this.setProcurementProductData());
        }else {
          this._messageDialogService.openDialogBox('Error', "Record already added", Constants.msgBoxError);
        }
      }else {
        var list = this.procurmentprdlist.filter(i => i.ProductId == this.ProductIdVal);
        if(list.length == 0) {
          this.addProcurePrd(this.setProcurementProductData());
        }else {
          this._messageDialogService.openDialogBox('Error', "Record already added", Constants.msgBoxError);
        }
      }

    }    
  }

  setProcurementProductData() {
    var object: any = {};
    object.ProductId = this.ProductIdVal;
    object.ProductName = this.ProductNameVal;
    object.Quantity = this.procurementFormGroup.value.Quantity;
    object.UOM = this.UomVal;
    object.Rate = this.procurementFormGroup.value.ProcurementRate;
    object.TotalAmount = (this.procurementFormGroup.value.Quantity * this.procurementFormGroup.value.ProcurementRate);
    return object;
  }

  addProcurePrd(procurementPrd: any) {

    if(procurementPrd.ProductId != undefined) {
      this.TotalProductProcurementAmount = 0;
      this.procurmentprdlist.push(procurementPrd);

      this.dataSource = new MatTableDataSource<any>(this.procurmentprdlist);
      this.dataSource.sort = this.sort;
      this.array = this.procurmentprdlist;

      this.procurmentprdlist.forEach(i => {
        this.TotalProductProcurementAmount = this.TotalProductProcurementAmount + i.TotalAmount;
      });

      if (this.procurementFormGroup.value.TransportExpense != null) {
        this.procurementFormGroup.patchValue({
          TotalAmount: this.TotalProductProcurementAmount + this.procurementFormGroup.value.TransportExpense
        });
      }else {
        this.procurementFormGroup.patchValue({
          TotalAmount: this.TotalProductProcurementAmount
        });
      }

      if (this.procurementFormGroup.value.AmountPaid != null && this.procurementFormGroup.value.AmountPaid > 0) {
        this.procurementFormGroup.patchValue({
          AmountPending: this.procurementFormGroup.value.TotalAmount - this.procurementFormGroup.value.AmountPaid
        });
      } else {
        this.procurementFormGroup.patchValue({ AmountPending: null });
      }
    }

    this.ProductIdVal = 0;
    this.ProductNameVal = '';
    this.UomVal = '',

    this.procurementFormGroup.controls['ProductId'].setValue(0);
    this.procurementFormGroup.controls['Quantity'].setValue(null);
    this.procurementFormGroup.controls['UOM'].setValue('');
    this.procurementFormGroup.controls['ProcurementRate'].setValue(null);
  
    this.procurementFormGroup.controls['Quantity'].markAsUntouched();
    this.procurementFormGroup.controls['ProcurementRate'].markAsUntouched();
  }

  validProcurementProductAddForm() {
    if (this.ProductIdVal == 0) {
      return true;
    }
    if (this.procurementFormGroup.controls.Quantity.invalid) {
      return true;
    }
    if (this.UomVal == '') {
      return true;
    }
    if (this.procurementFormGroup.controls.ProcurementRate.invalid) {
      return true;
    }
    return false;
  }

  async getFarmers(searchParameter) {
    this.farmers = [{ "Identifier": 0, "Name": "Select Farmer" }];
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
    var response = await this.apicallservice.getFarmers(searchParameter);
    let _lst = response.list;
    this.farmers = [...this.farmers, ..._lst];
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

    if (this.ProcurementIdentifier > 0) {
      this.getProcurementDetails();
      this.EditModeOn = true;
    }
  }

  async getProcurementDetails() {

    let searchParameter: any = {};
    searchParameter.IsProcurementProductRequired = true;
    searchParameter.Identifier = this.ProcurementIdentifier;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = 'id';
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Exact;

    var response = await this.apicallservice.getProcurements(searchParameter);
    if (response != null && response.list != null && response.list.length > 0) {
      this.ProcurementDetail = response.list[0];

      this.procurementFormGroup.patchValue({
        ProcurementDate: this.ProcurementDetail.ProcurementDate,
        FarmerId: this.ProcurementDetail.FarmerId,
        TransportExpense: this.ProcurementDetail.TransportExpense,
        TotalAmount: this.ProcurementDetail.TotalAmount,
        AmountPaid: this.ProcurementDetail.AmountPaid,
        AmountPending: this.ProcurementDetail.PendingAmount,
        PaymentCycle: this.ProcurementDetail.PaymentCycle,
        Remark: this.ProcurementDetail.Remark,
      });

      this.procurmentprdlist = this.ProcurementDetail.ProcurementProducts;
      this.dataSource = new MatTableDataSource<any>(this.procurmentprdlist);
      this.dataSource.sort = this.sort;
      this.array = this.procurmentprdlist;

      this.procurmentprdlist.forEach(i => {
        this.TotalProductProcurementAmount = this.TotalProductProcurementAmount + i.TotalAmount;
      });

      this.FarmerIdVal = this.ProcurementDetail.FarmerId;
      this.FarmerNameVal = this.ProcurementDetail.FarmerName;
      this.ProductIdVal = this.ProcurementDetail.ProductId;
      this.ProductNameVal = this.ProcurementDetail.ProductName;
      this.UomVal = this.ProcurementDetail.UOM;
      this.ProcurementIdentifier = this.ProcurementDetail.Identifier;
    }

  }

  onFarmerSelected(event) {
    const value = event.target.value;
    if (value == "0") {
      this.procurementFormErrorObject.farmerShowError = true;
      this.FarmerIdVal = 0;
      this.FarmerNameVal = '';
    }
    else {
      this.procurementFormErrorObject.farmerShowError = false;
      this.FarmerIdVal = Number(value);
      this.FarmerNameVal = this.farmers.filter(it => it.Identifier == this.FarmerIdVal)[0].Name;
    }
  }

  onProductSelected(event) {
    const value = event.target.value;
    if (value == "0") {
      this.procurementFormErrorObject.productShowError = true;
      this.ProductIdVal = 0;
      this.ProductNameVal = '';
    }
    else {
      this.procurementFormErrorObject.productShowError = false;
      this.ProductIdVal = Number(value);
      this.ProductNameVal = this.products.filter(it => it.Identifier == this.ProductIdVal)[0].ProductName;
    }
  }

  onUomSelected(event) {
    const value = event.target.value;
    if (value == '') {
      this.procurementFormErrorObject.UOMShowError = true;
      this.UomVal = '';
    }
    else {
      this.procurementFormErrorObject.UOMShowError = false;
      this.UomVal = value;
    }
  }

  onQuantityValueChange() {
    if (this.procurementFormGroup.value.Quantity != null && this.procurementFormGroup.value.Quantity > 0) {
      if (this.procurementFormGroup.value.ProcurementRate != null && this.procurementFormGroup.value.ProcurementRate > 0 &&
        this.procurementFormGroup.value.TransportExpense != null) {
        this.procurementFormGroup.patchValue({
          TotalAmount: (this.procurementFormGroup.value.Quantity *
            this.procurementFormGroup.value.ProcurementRate) + this.procurementFormGroup.value.TransportExpense
        });

        if (this.procurementFormGroup.value.AmountPaid != null && this.procurementFormGroup.value.AmountPaid > 0) {
          this.procurementFormGroup.patchValue({
            AmountPending: this.procurementFormGroup.value.TotalAmount - this.procurementFormGroup.value.AmountPaid
          });
        } else {
          this.procurementFormGroup.patchValue({ AmountPending: null });
        }

      } else {
        this.procurementFormGroup.patchValue({ TotalAmount: null });
        this.procurementFormGroup.patchValue({ AmountPending: null });
      }
    } else {
      this.procurementFormGroup.patchValue({ TotalAmount: null });
      this.procurementFormGroup.patchValue({ AmountPending: null });
    }
  }

  onProcurementRateValueChange() {
    if (this.procurementFormGroup.value.ProcurementRate != null && this.procurementFormGroup.value.ProcurementRate > 0) {
      if (this.procurementFormGroup.value.Quantity != null && this.procurementFormGroup.value.Quantity > 0 &&
        this.procurementFormGroup.value.TransportExpense != null) {
        this.procurementFormGroup.patchValue({
          TotalAmount: (this.procurementFormGroup.value.Quantity *
            this.procurementFormGroup.value.ProcurementRate) + this.procurementFormGroup.value.TransportExpense
        });

        if (this.procurementFormGroup.value.AmountPaid != null && this.procurementFormGroup.value.AmountPaid > 0) {
          this.procurementFormGroup.patchValue({
            AmountPending: this.procurementFormGroup.value.TotalAmount - this.procurementFormGroup.value.AmountPaid
          });
        } else {
          this.procurementFormGroup.patchValue({ AmountPending: null });
        }

      } else {
        this.procurementFormGroup.patchValue({ TotalAmount: null });
        this.procurementFormGroup.patchValue({ AmountPending: null });
      }
    } else {
      this.procurementFormGroup.patchValue({ TotalAmount: null });
      this.procurementFormGroup.patchValue({ AmountPending: null });
    }
  }

  onTransportExpenseValueChange() {
    if (this.procurementFormGroup.value.TransportExpense != null) {
      this.procurementFormGroup.patchValue({
        TotalAmount: this.TotalProductProcurementAmount + this.procurementFormGroup.value.TransportExpense
      });

      if (this.procurementFormGroup.value.AmountPaid != null && this.procurementFormGroup.value.AmountPaid > 0) {
        this.procurementFormGroup.patchValue({
          AmountPending: this.procurementFormGroup.value.TotalAmount - this.procurementFormGroup.value.AmountPaid
        });
      }

    } else {
      this.procurementFormGroup.patchValue({ TotalAmount: null });
      this.procurementFormGroup.patchValue({ AmountPending: null });
    }
  }

  onTotalAmountValueChange() {
    if (this.procurementFormGroup.value.TotalAmount != null && this.procurementFormGroup.value.TotalAmount > 0) {
      if (this.procurementFormGroup.value.AmountPaid != null && this.procurementFormGroup.value.AmountPaid > 0) {
        this.procurementFormGroup.patchValue({
          AmountPending: this.procurementFormGroup.value.TotalAmount - this.procurementFormGroup.value.AmountPaid
        });
      } else {
        this.procurementFormGroup.patchValue({ AmountPending: null });
      }
    } else {
      this.procurementFormGroup.patchValue({ AmountPending: null });
    }
  }

  onAmountPaidValueChange() {
    if (this.procurementFormGroup.value.AmountPaid != null && this.procurementFormGroup.value.AmountPaid > 0) {
      if (this.procurementFormGroup.value.TotalAmount != null && this.procurementFormGroup.value.TotalAmount > 0) {
        this.procurementFormGroup.patchValue({
          AmountPending: this.procurementFormGroup.value.TotalAmount - this.procurementFormGroup.value.AmountPaid
        });
      } else {
        this.procurementFormGroup.patchValue({ AmountPending: null });
      }
    } else {
      this.procurementFormGroup.patchValue({ AmountPending: null });
    }
  }

  onProcurementDateChange(event) {
    if (this.procurementFormGroup.value.ProcurementDate != null && this.procurementFormGroup.value.ProcurementDate != '') {
      let procureDte = this.procurementFormGroup.value.ProcurementDate;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (procureDte.getTime() < today.getTime()) {
        this.ProcurmentDateError = true;
        this.ProcurmentDateErrorMessage = ErrorMessageConstants.getProcurementDateLessThanCurrentDateMessage;
      } else {
        this.ProcurmentDateError = false;
        this.ProcurmentDateErrorMessage = '';
      }
    }
  }

  saveBtnValidation(): boolean {
    if (this.ProcurmentDateError || this.procurementFormGroup.value.ProcurementDate == null) {
      return true;
    }
    if (this.FarmerIdVal == 0) {
      return true;
    }
    // if (this.ProductIdVal == 0) {
    //   return true;
    // }
    // if (this.procurementFormGroup.controls.Quantity.invalid) {
    //   return true;
    // }
    // if (this.UomVal == '') {
    //   return true;
    // }
    // if (this.procurementFormGroup.controls.ProcurementRate.invalid) {
    //   return true;
    // }
    if (this.procurementFormGroup.controls.TransportExpense.invalid) {
      return true;
    }
    if (this.procurementFormGroup.controls.TotalAmount.invalid) {
      return true;
    }
    if (this.procurementFormGroup.controls.AmountPaid.invalid) {
      return true;
    }
    if (this.procurementFormGroup.controls.AmountPending.invalid) {
      return true;
    }
    if (this.procurementFormGroup.controls.Remark.invalid) {
      return true;
    }
    return false;
  }

  OnCancelBtnClicked() {
    const router = this.injector.get(Router);
    router.navigate(['procurment']);
  }

  OnSaveBtnClicked() {
    let procurement: any = {};
    procurement.ProcurementDate = this.procurementFormGroup.value.ProcurementDate;
    procurement.FarmerId = this.FarmerIdVal;
    procurement.FarmerName = this.FarmerNameVal;
    procurement.ProcurementProducts = this.procurmentprdlist;
    procurement.TransportExpense = this.procurementFormGroup.value.TransportExpense;
    procurement.TotalAmount = this.procurementFormGroup.value.TotalAmount;
    procurement.AmountPaid = this.procurementFormGroup.value.AmountPaid;
    procurement.PendingAmount = this.procurementFormGroup.value.AmountPending;
    procurement.PaymentCycle = this.procurementFormGroup.value.PaymentCycle;
    procurement.Remark = this.procurementFormGroup.value.Remark;
    if (this.EditModeOn) {
      procurement.Identifier = this.ProcurementIdentifier;
    }
    this.SaveProcurementDetails(procurement);
  }

  async SaveProcurementDetails(procurement) {
    let data = [];
    data.push(procurement);
    let isRecordSaved = await this.apicallservice.saveProcurement(data, this.EditModeOn);
    this.uiLoader.stop();
    if (isRecordSaved) {
      let message = Constants.recordAddedMessage;
      if (this.EditModeOn) {
        message = Constants.recordUpdatedMessage;
        localStorage.removeItem("procEditRouteparams");
      }

      this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
      const router = this.injector.get(Router);
      router.navigate(['procurment']);
    }
  }

}
