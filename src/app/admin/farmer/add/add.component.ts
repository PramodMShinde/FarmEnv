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

  public farmerFormGroup: FormGroup;
  public onlyAlphabetswithInbetweenSpaceUpto50Characters = Constants.onlyAlphabetswithInbetweenSpaceUpto50Characters;
  public onlyNumbers = '[0-9]{10,10}';
  public EditModeOn: boolean = false;
  public params: any = {};
  public FarmerIdentifier = 0;
  public FarmerDetail: any = {};

  get farmerName() {
    return this.farmerFormGroup.get('farmerName');
  }
  get mobileNumber() {
    return this.farmerFormGroup.get('mobileNumber');
  }
  get addressLine1() {
    return this.farmerFormGroup.get('addressLine1');
  }
  get addressLine2() {
    return this.farmerFormGroup.get('addressLine2');
  }
  get city() {
    return this.farmerFormGroup.get('city');
  }
  get pincode() {
    return this.farmerFormGroup.get('pincode');
  }
  get state() {
    return this.farmerFormGroup.get('state');
  }

  get pf() {
    return this.farmerFormGroup.controls;
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
        if (e.url.includes('/farmers')) {
          //set passing parameters to localstorage.
          if (localStorage.getItem('farmerEditRouteparams')) {
            this.params = JSON.parse(localStorage.getItem('farmerEditRouteparams'));
            this.FarmerIdentifier = this.params.Routeparams.passingparams.Identifier
          }
        }
        else {
          localStorage.removeItem("farmerEditRouteparams");
        }
      }
    });
  }

  ngOnInit() {

    //Validations for Page Form.
    this.farmerFormGroup = this.formbuilder.group({
      farmerName: [null, Validators.compose([Validators.required, Validators.minLength(Constants.inputMinLenth),
      Validators.maxLength(Constants.inputMaxLenth), Validators.pattern(this.onlyAlphabetswithInbetweenSpaceUpto50Characters)])],
      mobileNumber: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10),
      Validators.pattern(this.onlyNumbers)])],
      addressLine1: [null, Validators.compose([Validators.required])],
      addressLine2: [null, Validators.compose([Validators.required])],
      city: [null, Validators.compose([Validators.required])],
      pincode: [null, Validators.compose([Validators.required])],
      state: [null, Validators.compose([Validators.required])],
    });

    if (this.FarmerIdentifier > 0) {
      this.getFarmerDetails();
      this.EditModeOn = true;
    }

  }

  async getFarmerDetails() {

    let searchParameter: any = {};
    searchParameter.IsActive = true;
    searchParameter.Identifier = this.FarmerIdentifier;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = Constants.Name;
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Exact;

    var response = await this.apicallservice.getFarmers(searchParameter);
    if (response != null && response.list != null && response.list.length > 0) {
      this.FarmerDetail = response.list[0];
      this.farmerFormGroup.patchValue({
        farmerName: this.FarmerDetail.Name,
        mobileNumber: this.FarmerDetail.MobileNumber,
        addressLine1: this.FarmerDetail.AddressLine1,
        addressLine2: this.FarmerDetail.AddressLine2,
        city: this.FarmerDetail.City,
        pincode: this.FarmerDetail.Pincode,
        state: this.FarmerDetail.State
      });
    }

  }

  saveBtnValidation(): boolean {
    if (this.farmerFormGroup.controls.farmerName.invalid) {
      return true;
    }
    if (this.farmerFormGroup.controls.mobileNumber.invalid) {
      return true;
    }
    if (this.farmerFormGroup.controls.addressLine1.invalid) {
      return true;
    }
    if (this.farmerFormGroup.controls.addressLine2.invalid) {
      return true;
    }
    if (this.farmerFormGroup.controls.city.invalid) {
      return true;
    }
    if (this.farmerFormGroup.controls.pincode.invalid) {
      return true;
    }
    if (this.farmerFormGroup.controls.state.invalid) {
      return true;
    }
    return false;
  }

  OnCancelBtnClicked() {
    const router = this.injector.get(Router);
    router.navigate(['farmers']);
  }

  OnSaveBtnClicked() {
    let farmer: any = {};
    farmer.Name = this.farmerFormGroup.value.farmerName;
    farmer.MobileNumber = this.farmerFormGroup.value.mobileNumber;
    farmer.AddressLine1 = this.farmerFormGroup.value.addressLine1;
    farmer.AddressLine2 = this.farmerFormGroup.value.addressLine2;
    farmer.City = this.farmerFormGroup.value.city;
    farmer.Pincode = this.farmerFormGroup.value.pincode;
    farmer.State = this.farmerFormGroup.value.state;
    if (this.EditModeOn) {
      farmer.Identifier = this.FarmerIdentifier;
    }
    this.SaveFarmerDetails(farmer);
  }

  async SaveFarmerDetails(farmer) {
    let data = [];
    data.push(farmer);
    let isRecordSaved = await this.apicallservice.saveFarmer(data, this.EditModeOn);
    this.uiLoader.stop();
    if (isRecordSaved) {
      let message = Constants.recordAddedMessage;
      if (this.EditModeOn) {
        message = Constants.recordUpdatedMessage;
        localStorage.removeItem("farmerEditRouteparams");
      }

      this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
      const router = this.injector.get(Router);
      router.navigate(['farmers']);
    }
  }

}
