import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageDialogService } from 'src/app/services/message-dialog.service';
import { URLConfiguration } from 'src/app/shared/urlConfiguration';
import { HttpClientService } from 'src/app/services/httpClient.service';
import { Constants } from 'src/app/shared/constants/constants';
import { promise } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {

  public list: any[] = [];
  public isRecordFound: boolean = false;
  public isRecordSaved: boolean = false;
  public isRecordDeleted = {};
  public resultFlag = {};
  private BaseUrl = "http://impramod-001-site1.gtempurl.com/";

  constructor(private http: HttpClient,
    private injector: Injector,
    private uiLoader: NgxUiLoaderService,
    private _messageDialogService: MessageDialogService) { }

  Login(loginObj) {
    function ObjectsToParams(loginObj) {
      var p = [];
      for (var key in loginObj) {
        p.push(key + '=' + encodeURIComponent(loginObj[key]));
      }
      return p.join('&');
    }
    return this.http.post(this.BaseUrl + "login", ObjectsToParams(loginObj),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        observe: 'response'
      }
    );
  }

  //method to call api of get procurement records.
  async getProcurements(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.procurementGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //service method to save or update procurement records
  public async saveProcurement(postData, editModeOn): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.procurementAddeUrl;
    if (editModeOn) {
        requestUrl = URLConfiguration.procurementUpdateeUrl;
    }
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
          if (httpEvent.type == HttpEventType.Response) {
              this.uiLoader.stop();
              if (httpEvent["status"] === 200) {
                  this.isRecordSaved = true;
              }
              else {
                  this.isRecordSaved = false;
              }
          }
      }, (error) => {
          this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
          this.isRecordSaved = false;
          this.uiLoader.stop();
      });
    return <boolean>this.isRecordSaved;
  }

  //method to call api of delete procurement record.
  public async deleteProcurment(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.procurementDeleteUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.isRecordDeleted = true;
          }
          else {
            this.isRecordDeleted = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.isRecordDeleted = false;
      });
    return <boolean>this.isRecordDeleted;
  }

  //method to call api of get farmer records.
  async getFarmers(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.farmerGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //service method to save or update farmer records
  public async saveFarmer(postData, editModeOn): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.farmerAddeUrl;
    if (editModeOn) {
        requestUrl = URLConfiguration.farmerUpdateeUrl;
    }
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
          if (httpEvent.type == HttpEventType.Response) {
              this.uiLoader.stop();
              if (httpEvent["status"] === 200) {
                  this.isRecordSaved = true;
              }
              else {
                  this.isRecordSaved = false;
              }
          }
      }, (error) => {
          this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
          this.isRecordSaved = false;
          this.uiLoader.stop();
      });
    return <boolean>this.isRecordSaved;
  }

  //method to call api of delete farmer record.
  public async deleteFarmer(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.farmerDeleteUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.isRecordDeleted = true;
          }
          else {
            this.isRecordDeleted = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.isRecordDeleted = false;
      });
    return <boolean>this.isRecordDeleted;
  }

  //method to call api of activate farmer record.
  public async activateFarmer(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.farmerActivateUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.resultFlag = true;
          }
          else {
            this.resultFlag = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.resultFlag = false;
      });
    return <boolean>this.resultFlag;
  }

  //method to call api of de-activate farmer record.
  public async deactivateFarmer(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.farmerDeactivateUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.resultFlag = true;
          }
          else {
            this.resultFlag = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.resultFlag = false;
      });
    return <boolean>this.resultFlag;
  }

  //method to call api of get vendor records.
  async getVendors(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.vendorGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //service method to save or update vendor records
  public async saveVendor(postData, editModeOn): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.vendorAddeUrl;
    if (editModeOn) {
        requestUrl = URLConfiguration.vendorUpdateeUrl;
    }
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
          if (httpEvent.type == HttpEventType.Response) {
              this.uiLoader.stop();
              if (httpEvent["status"] === 200) {
                  this.isRecordSaved = true;
              }
              else {
                  this.isRecordSaved = false;
              }
          }
      }, (error) => {
          this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
          this.isRecordSaved = false;
          this.uiLoader.stop();
      });
    return <boolean>this.isRecordSaved;
  }

  //method to call api of delete vendor record.
  public async deleteVendor(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.vendorDeleteUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.isRecordDeleted = true;
          }
          else {
            this.isRecordDeleted = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.isRecordDeleted = false;
      });
    return <boolean>this.isRecordDeleted;
  }

  //method to call api of activate vendor record.
  public async activateVendor(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.vendorActivateUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.resultFlag = true;
          }
          else {
            this.resultFlag = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.resultFlag = false;
      });
    return <boolean>this.resultFlag;
  }

  //method to call api of de-activate vendor record.
  public async deactivateVendor(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.vendorDeactivateUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.resultFlag = true;
          }
          else {
            this.resultFlag = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.resultFlag = false;
      });
    return <boolean>this.resultFlag;
  }

  //method to call api of get product records.
  async getProducts(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.productGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //service method to save or update product records
  public async saveProduct(postData, editModeOn): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.productAddeUrl;
    if (editModeOn) {
        requestUrl = URLConfiguration.productUpdateeUrl;
    }
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
          if (httpEvent.type == HttpEventType.Response) {
              this.uiLoader.stop();
              if (httpEvent["status"] === 200) {
                  this.isRecordSaved = true;
              }
              else {
                  this.isRecordSaved = false;
              }
          }
      }, (error) => {
          this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
          this.isRecordSaved = false;
          this.uiLoader.stop();
      });
    return <boolean>this.isRecordSaved;
  }

  //method to call api of delete product record.
  public async deleteProduct(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.productDeleteUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.isRecordDeleted = true;
          }
          else {
            this.isRecordDeleted = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.isRecordDeleted = false;
      });
    return <boolean>this.isRecordDeleted;
  }

  //method to call api of activate product record.
  public async activateProduct(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.productActivateUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.resultFlag = true;
          }
          else {
            this.resultFlag = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.resultFlag = false;
      });
    return <boolean>this.resultFlag;
  }

  //method to call api of de-activate product record.
  public async deactivateProduct(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.productDeactivateUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.resultFlag = true;
          }
          else {
            this.resultFlag = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.resultFlag = false;
      });
    return <boolean>this.resultFlag;
  }

  //method to call api of get sale records.
  async getSales(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.saleGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //service method to save or update sales records
  public async saveSales(postData, editModeOn): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.saleAddeUrl;
    if (editModeOn) {
        requestUrl = URLConfiguration.saleUpdateeUrl;
    }
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
          if (httpEvent.type == HttpEventType.Response) {
              this.uiLoader.stop();
              if (httpEvent["status"] === 200) {
                  this.isRecordSaved = true;
              }
              else {
                  this.isRecordSaved = false;
              }
          }
      }, (error) => {
          this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
          this.isRecordSaved = false;
          this.uiLoader.stop();
      });
    return <boolean>this.isRecordSaved;
  }

  //method to call api of delete sale record.
  public async deleteSale(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.saleDeleteUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.isRecordDeleted = true;
          }
          else {
            this.isRecordDeleted = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.isRecordDeleted = false;
      });
    return <boolean>this.isRecordDeleted;
  }

  //method to call api of get inventory records.
  async getInventories(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.inventoryGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //service method to save or update inventory records
  public async saveInventories(postData, editModeOn): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.inventoryAddeUrl;
    if (editModeOn) {
        requestUrl = URLConfiguration.inventoryUpdateeUrl;
    }
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
          if (httpEvent.type == HttpEventType.Response) {
              this.uiLoader.stop();
              if (httpEvent["status"] === 200) {
                  this.isRecordSaved = true;
              }
              else {
                  this.isRecordSaved = false;
              }
          }
      }, (error) => {
          this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
          this.isRecordSaved = false;
          this.uiLoader.stop();
      });
    return <boolean>this.isRecordSaved;
  }

  //method to call api of delete inventory record.
  public async deleteInventory(postData): Promise<boolean> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.inventoryDeleteUrl;
    this.uiLoader.start();
    await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          this.uiLoader.stop();
          if (httpEvent["status"] === 200) {
            this.isRecordDeleted = true;
          }
          else {
            this.isRecordDeleted = false;
          }
        }
      }, (error) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this.uiLoader.stop();
        this.isRecordDeleted = false;
      });
    return <boolean>this.isRecordDeleted;
  }

  //method to call api of get product wise procurement and sale details records.
  public async GetProductwiseProcurementVsSaleDetails(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.ProductwiseProcurementVsSaleDetailsGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //method to call api of get farmer payment details records.
  public async GetFarmerPaymentDetails(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.FarmerPaymentDetailseGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }

  //method to call api of get vendor payment details records.
  public async GetVendorPaymentDetails(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.VendorPaymentDetailseGetUrl;
    this.uiLoader.start();
    var response : any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
        .then((httpEvent: HttpEvent<any>) => {
            if (httpEvent.type == HttpEventType.Response) {
                if (httpEvent["status"] === 200) {
                    this.list = [];
                    this.uiLoader.stop();
                    httpEvent['body'].forEach(pageObject => {
                        this.list = [...this.list, pageObject];
                    });
                    response.list = this.list;
                    response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                }
                else {
                    this.list = [];
                    response.list = this.list;
                    response.RecordCount = 0;
                    this.uiLoader.stop();
                }
            }
        }, (error: HttpResponse<any>) => {
            this.list = [];
            this.uiLoader.stop();
            if (error["error"] != null) {
                let errorMessage = error["error"].Error["Message"];
                this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
            }
        });
    return response
  }
}
