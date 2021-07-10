import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpEvent, HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageDialogService } from '../services/message-dialog.service';
import { ApicallService } from '../services/apicall.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userEmail: any;
  public loginErrorMsg: string = '';
  public loginForm: FormGroup;
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  public emailPatternRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public isLogin: boolean = true;
  public isForgotPassword: boolean = false;
  public errorMsg: boolean;
  public result;
  public status;

  // login form error Obj created.
  public loginFormErrorObject: any = {
    showUserNameError: false,
    showPasswordError: false,
  };

  //getters of loginForm group
  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(private fb: FormBuilder,
    private route: Router,
    private http: HttpClient,
    private spinner: NgxUiLoaderService,
    private injector: Injector,
    private _messageDialogService: MessageDialogService,
    private apicallservice: ApicallService,
    private localstorageservice: LocalStorageService) { }

  isForgotPassswordForm() {
    this.isForgotPassword = true;
    this.isLogin = false;
  }

  isLoginForm() {
    this.isForgotPassword = false;
    this.isLogin = true;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(this.emailPatternRegex)]],
      password: ['', [Validators.required]]
    });
  }

  //Form validtion check on login click--
  OnSubmit() {
    this.loginErrorMsg = '';
    this.errorMsg = false;
    if (this.loginFormValidaton()) {
      let loginObj: any = {
        grant_type: 'password',
        client_id: '00000000-0000-0000-0000-000000000000',
        username: this.loginForm.value.userName,
        password: this.loginForm.value.password
      }
      this.checkLogin(loginObj);
    }
    else {
      //this.errorMsg = true;
    }
  };

  //custom validation check
  loginFormValidaton(): boolean {
    this.loginFormErrorObject.showUserNameError = false;
    this.loginFormErrorObject.showPasswordError = false;

    if (this.loginForm.controls.userName.invalid) {
      this.loginFormErrorObject.showUserNameError = true;
      return false;
    }
    if (this.loginForm.controls.password.invalid) {
      this.loginFormErrorObject.showPasswordError = true;
      return false;
    }
    return true;
  }

  onForgotPasswordSubmit(): boolean {
    if (this.userEmail == undefined || this.userEmail == null) {
      this._messageDialogService.openDialogBox('Error', "Please enter Email ID.", "Error");
      return this.result = false;
    }
    if (this.userEmail != undefined && this.userEmail != null && this.userEmail.length == 0) {
      this.status = "Please enter Email ID";
      this._messageDialogService.openDialogBox('Error', "Please enter Email ID.", "Error");
      return this.result = false;
    }
    else if (!this.emailPatternRegex.test(this.userEmail)) {
      this._messageDialogService.openDialogBox('Error', "Invalid email address.", "Error");
      return this.result = false;
    }

    this.isLoginForm();
  }

  //Login functinality--
  checkLogin(loginObj) {
    this.spinner.start();
    localStorage.setItem("DateFormat", "dd/MM/yyyy");
    //this.route.navigate(["dashboard"]);
    this.apicallservice.Login(loginObj).subscribe(async (response: HttpResponse<any>) => {
      if (response.status == 200) {
        this.spinner.stop();
        this.isLogin = true;
        let data = response.body;
        let userData: any = {};
        userData.UserIdentifier = data.UserIdentifier;
        userData.UserName = data.UserName;
        userData.UserPrimaryEmailAddress = data.UserPrimaryEmailAddress;
        this.localstorageservice.SetCurrentUser(data);
        localStorage.setItem("UserId", userData.UserIdentifier);
        localStorage.setItem("UserEmail", userData.UserPrimaryEmailAddress);
        localStorage.setItem("currentUserName", userData.UserName);
        this.route.navigate(["dashboard"]);
      }
    }, (error: HttpResponse<any>) => {
      this.spinner.stop();
      if (error["error"]) {
        if (error["error"].error_description) {
          let errorMessage = error["error"].error_description;
          if (errorMessage == 'User not found') {
            errorMessage = 'Email Id not registered with us..!!';
          }
          this._messageDialogService.openDialogBox('Error', errorMessage, "Error");
        }
      }
    });
  }

  ResetPassword() {
    this.isForgotPassword = false;
    this.isLogin = true;
  }

  CancelAction() {
    this.isForgotPassword = false;
    this.isLogin = true;
  }

}
