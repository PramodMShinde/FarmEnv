import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    
  CurrentUser = null;

  constructor(private http: HttpClient) { }

  SetCurrentUser(user) {
    this.CurrentUser = JSON.stringify(user);
    localStorage.setItem('user', this.CurrentUser);
  }

  GetCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  removeLocalStorageData() {
    localStorage.clear();
  }
}
