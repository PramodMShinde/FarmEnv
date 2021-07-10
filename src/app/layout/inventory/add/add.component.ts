import { Component, OnInit, Injector } from '@angular/core';
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
import { debug } from 'console';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent implements OnInit {

  public inventoryFormGroup: FormGroup;
  public EditModeOn: boolean = false;
  public params: any = {};
  public InventoryIdentifier = 0;
  public InventoryDetail: any = {};
  public invFormErrorObject: any = {};
  public ProductIdVal = 0;
  public ProductNameVal = '';
  public ProcureUomVal = '';
  public SaleUomVal = '';
  public products = [];
  public _lstProcureUom = [{ 'Val': '', 'Name': 'Select UOM' }, { 'Val': 'KG', 'Name': 'KG' },
  { 'Val': 'GRAM', 'Name': 'GRAM' }, { 'Val': 'PCS', 'Name': 'PCS' }];
  public _lstSaleUom = [{ 'Val': '', 'Name': 'Select UOM' }, { 'Val': 'KG', 'Name': 'KG' },
  { 'Val': 'GRAM', 'Name': 'GRAM' }, { 'Val': 'PCS', 'Name': 'PCS' }];

  get ProductId() {
    return this.inventoryFormGroup.get('ProductId');
  }
  get ProcureQuantity() {
    return this.inventoryFormGroup.get('ProcureQuantity');
  }
  get ProcureUOM() {
    return this.inventoryFormGroup.get('ProcureUOM');
  }
  get SaleQuantity() {
    return this.inventoryFormGroup.get('SaleQuantity');
  }
  get SaleUOM() {
    return this.inventoryFormGroup.get('SaleUOM');
  }
  get Wastage() {
    return this.inventoryFormGroup.get('Wastage');
  }
  get PendingQty() {
    return this.inventoryFormGroup.get('PendingQty');
  }
  get pf() {
    return this.inventoryFormGroup.controls;
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
        if (e.url.includes('/inventory')) {
          //get passing parameters to localstorage.
          if (localStorage.getItem('invEditRouteparams')) {
            this.params = JSON.parse(localStorage.getItem('invEditRouteparams'));
            this.InventoryIdentifier = this.params.Routeparams.passingparams.Identifier
          }
        }
        else {
          localStorage.removeItem("invEditRouteparams");
        }
      }
    });
  }

  ngOnInit() {

    //Validations for inventory Form.
    this.inventoryFormGroup = this.formbuilder.group({
      ProductId: [0, Validators.compose([Validators.required])],
      ProcureQuantity: [null, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(Constants.onlyNumbersWithDot)])],
      ProcureUOM: ['', Validators.compose([Validators.required])],
      SaleQuantity: [null, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(Constants.onlyNumbersWithDot)])],
      SaleUOM: ['', Validators.compose([Validators.required])],
      Wastage: [null, Validators.compose([Validators.required, Validators.min(0), Validators.pattern(Constants.onlyNumbersWithDot)])],
      PendingQty: [null, Validators.compose([Validators.required, Validators.pattern(Constants.onlyNumbersWithDot)])],
    });

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

    if (this.InventoryIdentifier > 0) {
      this.getInventoryDetails();
      this.EditModeOn = true;
    }
  }

  async getInventoryDetails() {

    let searchParameter: any = {};
    searchParameter.IsActive = true;
    searchParameter.Identifier = this.InventoryIdentifier;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = 'id';
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Exact;

    var response = await this.apicallservice.getInventories(searchParameter);
    if (response != null && response.list != null && response.list.length > 0) {
      this.InventoryDetail = response.list[0];
      this.inventoryFormGroup.patchValue({
        ProductId: this.InventoryDetail.ProductId,
        ProcureQuantity: this.InventoryDetail.ProcurementQuantity,
        ProcureUOM: this.InventoryDetail.ProcurementUOM,
        SaleQuantity: this.InventoryDetail.SaleQuantity,
        SaleUOM: this.InventoryDetail.SaleUOM,
        Wastage: this.InventoryDetail.Wastage,
        PendingQty: this.InventoryDetail.PendingQuantity,
      });

      this.ProductIdVal = this.InventoryDetail.ProductId;
      this.ProductNameVal = this.InventoryDetail.ProductName;
      this.ProcureUomVal = this.InventoryDetail.ProcurementUOM;
      this.SaleUomVal = this.InventoryDetail.SaleUOM;
    }
  }

  onProductSelected(event) {
    const value = event.target.value;
    if (value == "0") {
      this.invFormErrorObject.productShowError = true;
      this.ProductIdVal = 0;
      this.ProductNameVal = '';
    }
    else {
      this.invFormErrorObject.productShowError = false;
      this.ProductIdVal = Number(value);
      this.ProductNameVal = this.products.filter(it => it.Identifier == this.ProductIdVal)[0].ProductName;
    }
  }

  onProcureUomSelected(event) {
    const value = event.target.value;
    if (value == '') {
      this.invFormErrorObject.ProcureUOMShowError = true;
      this.ProcureUomVal = '';
    }
    else {
      this.invFormErrorObject.ProcureUOMShowError = false;
      this.ProcureUomVal = value;
    }
  }

  onSaleUomSelected(event) {
    const value = event.target.value;
    if (value == '') {
      this.invFormErrorObject.SaleUOMShowError = true;
      this.SaleUomVal = '';
    }
    else {
      this.invFormErrorObject.SaleUOMShowError = false;
      this.SaleUomVal = value;
    }
  }

  onProcureQuantityValueChange() {
    this.inventoryFormGroup.patchValue({ PendingQty: null });
    if(this.inventoryFormGroup.value.ProcureQuantity != null) {
      if(this.inventoryFormGroup.value.SaleQuantity != null && this.inventoryFormGroup.value.SaleQuantity > -1 && 
        this.inventoryFormGroup.value.Wastage != null && this.inventoryFormGroup.value.Wastage > -1) {
          
          this.inventoryFormGroup.patchValue({ PendingQty: this.inventoryFormGroup.value.ProcureQuantity - 
            this.inventoryFormGroup.value.SaleQuantity - this.inventoryFormGroup.value.Wastage });
        }
    }
  }

  onSaleQuantityValueChange() {
    this.inventoryFormGroup.patchValue({ PendingQty: null });
    if(this.inventoryFormGroup.value.SaleQuantity != null && this.inventoryFormGroup.value.SaleQuantity > -1) {
      if(this.inventoryFormGroup.value.ProcureQuantity != null && this.inventoryFormGroup.value.ProcureQuantity > -1 && 
        this.inventoryFormGroup.value.Wastage != null && this.inventoryFormGroup.value.Wastage > -1) {
          
          this.inventoryFormGroup.patchValue({ PendingQty: this.inventoryFormGroup.value.ProcureQuantity - 
            this.inventoryFormGroup.value.SaleQuantity - this.inventoryFormGroup.value.Wastage });
        }
    }
  }
  
  onWastageValueChange() {
    this.inventoryFormGroup.patchValue({ PendingQty: null });
    if(this.inventoryFormGroup.value.Wastage != null && this.inventoryFormGroup.value.Wastage > -1) {
      if(this.inventoryFormGroup.value.ProcureQuantity != null && this.inventoryFormGroup.value.ProcureQuantity > -1 && 
        this.inventoryFormGroup.value.SaleQuantity != null && this.inventoryFormGroup.value.SaleQuantity > -1) {
          
          this.inventoryFormGroup.patchValue({ PendingQty: this.inventoryFormGroup.value.ProcureQuantity - 
            this.inventoryFormGroup.value.SaleQuantity - this.inventoryFormGroup.value.Wastage });
        }
    }
  }

  saveBtnValidation(): boolean {
    if (this.ProductIdVal == 0) {
      return true;
    }
    if (this.inventoryFormGroup.controls.ProcureQuantity.invalid) {
      return true;
    }
    if (this.ProcureUomVal == '') {
      return true;
    }
    if (this.inventoryFormGroup.controls.SaleQuantity.invalid) {
      return true;
    }
    if (this.SaleUomVal == '') {
      return true;
    }
    if (this.inventoryFormGroup.controls.Wastage.invalid) {
      return true;
    }
    if (this.inventoryFormGroup.controls.PendingQty.invalid) {
      return true;
    }
    return false;
  }

  OnCancelBtnClicked() {
    const router = this.injector.get(Router);
    router.navigate(['inventory']);
  }

  OnSaveBtnClicked() {
    let inventory: any = {};
    inventory.ProductId = this.ProductIdVal;
    inventory.ProductName = this.ProductNameVal;
    inventory.ProcurementQuantity = this.inventoryFormGroup.value.ProcureQuantity;
    inventory.ProcurementUOM = this.inventoryFormGroup.value.ProcureUOM;
    inventory.SaleQuantity = this.inventoryFormGroup.value.SaleQuantity;
    inventory.SaleUOM = this.inventoryFormGroup.value.SaleUOM;
    inventory.Wastage = this.inventoryFormGroup.value.Wastage;
    inventory.PendingQuantity = this.inventoryFormGroup.value.PendingQty;
    if (this.EditModeOn) {
      inventory.Identifier = this.InventoryIdentifier;
    }
    this.SaveInventoryDetails(inventory);
  }

  async SaveInventoryDetails(inventory) {
    let data = [];
    data.push(inventory);
    let isRecordSaved = await this.apicallservice.saveInventories(data, this.EditModeOn);
    this.uiLoader.stop();
    if (isRecordSaved) {
      let message = Constants.recordAddedMessage;
      if (this.EditModeOn) {
        message = Constants.recordUpdatedMessage;
        localStorage.removeItem("invEditRouteparams");
      }

      this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
      const router = this.injector.get(Router);
      router.navigate(['inventory']);
    }
  }

}
