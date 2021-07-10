import { Component, OnInit, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageDialogService } from 'src/app/services/message-dialog.service';
import { DialogService } from '@tomblue/ng2-bootstrap-modal';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ApicallService } from '../../../services/apicall.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public vendorFormGroup: FormGroup;
  public onlyAlphabetswithInbetweenSpaceUpto50Characters = Constants.onlyAlphabetswithInbetweenSpaceUpto50Characters;
  public onlyNumbers = '[0-9]{10,10}';
  public EditModeOn: boolean = false;
  public params: any = {};
  public VendorIdentifier = 0;
  public VendorDetail: any = {};

  get vendorName() {
    return this.vendorFormGroup.get('vendorName');
  }
  get mobileNumber() {
    return this.vendorFormGroup.get('mobileNumber');
  }
  get location() {
    return this.vendorFormGroup.get('location');
  }
  get segment() {
    return this.vendorFormGroup.get('segment');
  }
  get addressLine1() {
    return this.vendorFormGroup.get('addressLine1');
  }
  get addressLine2() {
    return this.vendorFormGroup.get('addressLine2');
  }
  get city() {
    return this.vendorFormGroup.get('city');
  }
  get pincode() {
    return this.vendorFormGroup.get('pincode');
  }
  get state() {
    return this.vendorFormGroup.get('state');
  }

  get pf() {
    return this.vendorFormGroup.controls;
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
        if (e.url.includes('/vendors')) {
          //set passing parameters to localstorage.
          if (localStorage.getItem('vendorEditRouteparams')) {
            this.params = JSON.parse(localStorage.getItem('vendorEditRouteparams'));
            this.VendorIdentifier = this.params.Routeparams.passingparams.Identifier
          }
        }
        else {
          localStorage.removeItem("vendorEditRouteparams");
        }
      }
    });
  }

  ngOnInit() {

    //Validations for Page Form.
    this.vendorFormGroup = this.formbuilder.group({
      vendorName: [null, Validators.compose([Validators.required, Validators.minLength(Constants.inputMinLenth),
      Validators.maxLength(Constants.inputMaxLenth), Validators.pattern(this.onlyAlphabetswithInbetweenSpaceUpto50Characters)])],
      location: [null, Validators.compose([Validators.required])],
      segment: [null, Validators.compose([Validators.required])],
      mobileNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10),
      Validators.pattern(this.onlyNumbers)])],
      addressLine1: [null, Validators.compose([Validators.required])],
      addressLine2: [null, Validators.compose([Validators.required])],
      city: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required])],
      state: [null, Validators.compose([Validators.required])],
    });

    if (this.VendorIdentifier > 0) {
      this.getVendorDetails();
      this.EditModeOn = true;
    }

  }

  async getVendorDetails() {

    let searchParameter: any = {};
    searchParameter.IsActive = true;
    searchParameter.Identifier = this.VendorIdentifier;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = Constants.Name;
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Exact;

    var response = await this.apicallservice.getVendors(searchParameter);
    if (response != null && response.list != null && response.list.length > 0) {
      this.VendorDetail = response.list[0];
      this.vendorFormGroup.patchValue({
        vendorName: this.VendorDetail.Name,
        mobileNumber: this.VendorDetail.MobileNumber,
        location: this.VendorDetail.Location,
        segment: this.VendorDetail.Segment,
        addressLine1: this.VendorDetail.AddressLine1,
        addressLine2: this.VendorDetail.AddressLine2,
        city: this.VendorDetail.City,
        pincode: this.VendorDetail.Pincode,
        state: this.VendorDetail.State
      });
    }

  }

  saveBtnValidation(): boolean {
    if (this.vendorFormGroup.controls.vendorName.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.mobileNumber.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.location.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.segment.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.addressLine1.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.addressLine2.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.city.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.pincode.invalid) {
      return true;
    }
    if (this.vendorFormGroup.controls.state.invalid) {
      return true;
    }
    return false;
  }

  OnCancelBtnClicked() {
    const router = this.injector.get(Router);
    router.navigate(['vendors']);
  }

  OnSaveBtnClicked() {
    let vendor: any = {};
    vendor.Name = this.vendorFormGroup.value.vendorName;
    vendor.MobileNumber = this.vendorFormGroup.value.mobileNumber;
    vendor.Location = this.vendorFormGroup.value.location;
    vendor.Segment = this.vendorFormGroup.value.segment;
    vendor.AddressLine1 = this.vendorFormGroup.value.addressLine1;
    vendor.AddressLine2 = this.vendorFormGroup.value.addressLine2;
    vendor.City = this.vendorFormGroup.value.city;
    vendor.Pincode = this.vendorFormGroup.value.pincode;
    vendor.State = this.vendorFormGroup.value.state;
    if (this.EditModeOn) {
      vendor.Identifier = this.VendorIdentifier;
    }
    this.SaveVendorDetails(vendor);
  }

  async SaveVendorDetails(vendor) {
    let data = [];
    data.push(vendor);
    let isRecordSaved = await this.apicallservice.saveVendor(data, this.EditModeOn);
    this.uiLoader.stop();
    if (isRecordSaved) {
      let message = Constants.recordAddedMessage;
      if (this.EditModeOn) {
        message = Constants.recordUpdatedMessage;
        localStorage.removeItem("vendorEditRouteparams");
      }

      this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
      const router = this.injector.get(Router);
      router.navigate(['vendors']);
    }
  }

}
