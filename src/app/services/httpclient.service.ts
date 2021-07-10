import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
   
  private responseData: Observable<any>;
  private BaseUrl = "http://impramod-001-site1.gtempurl.com/";
   
  constructor(private http: HttpClient) {}
  
  public CallHttp(httpMethod: string, httpAction: string, requestData?: any, params?: any, header?:any) : Observable<any>{
    let url = this.BaseUrl + httpAction;
      httpMethod = httpMethod.toUpperCase();
      const req = new HttpRequest('POST', url, requestData, {
          reportProgress: true,
        });          
      this.responseData = this.http.request(req);
      return this.responseData;
  }

  public CallGetHttp(httpMethod: string, httpAction: string,  params?: any, header?:any) : Observable<any>{
    let url = this.BaseUrl + httpAction;
    httpMethod = httpMethod.toUpperCase();
    const req = new HttpRequest('GET', url);          
    this.responseData = this.http.request(req);
    return this.responseData;
  } 

}
