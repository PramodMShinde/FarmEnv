import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public toggleSidebarClass = '';
  public toggleBodyClass = '';
  public isToggled = false;
  public URL = '';
  public UserName = '';

  constructor(private route: Router,
    private injector: Injector,
    private localstorageservice: LocalStorageService) { }

  ngOnInit() {

    var user = this.localstorageservice.GetCurrentUser();
    console.log(user);
    this.UserName = user.UserName;

    var currentURL = this.route.url;
    if(currentURL.includes('/dashboard')) {
      this.URL = '/dashboard';
    }
    else if(currentURL.includes('/procurment')) {
      this.URL = '/procurment';
    }
    else if(currentURL.includes('/sales')) {
      this.URL = '/sales';
    }
    else if(currentURL.includes('/profitandloss')) {
      this.URL = '/profitandloss';
    }
    else if(currentURL.includes('/inventory')) {
      this.URL = '/inventory';
    }
    else if(currentURL.includes('/farmers')) {
      this.URL = '/farmers';
    }
    else if(currentURL.includes('/vendors')) {
      this.URL = '/vendors';
    }
    else if(currentURL.includes('/products')) {
      this.URL = '/products';
    }
  }

  toggleSidebar(){
    this.isToggled = !this.isToggled;
    if(this.isToggled) {
      this.toggleSidebarClass = 'toggled';
      this.toggleBodyClass = 'sidebar-toggled';
    }else {
      this.toggleSidebarClass = '';
      this.toggleBodyClass = '';
    }
  }

  navigateToDashoard() {
    this.URL = '/dashboard';
    this.route.navigate(['/dashboard']);
  }

  navigateToProcurement() {
    this.URL = '/procurment';
    this.route.navigate(['/procurment']);
  }

  navigateToSales() {
    this.URL = '/sales';
    this.route.navigate(['/sales']);
  }

  navigateToProftandloss() {
    this.URL = '/profitandloss';
    this.route.navigate(['/profitandloss']);
  }

  navigateToInventory() {
    this.URL = '/inventory';
    this.route.navigate(['/inventory']);
  }

  navigateToFarmer() {
    this.URL = '/farmers';
    this.route.navigate(['/farmers']);
  }

  navigateToVendor() {
    this.URL = '/vendors';
    this.route.navigate(['/vendors']);
  }

  navigateToProduct() {
    this.URL = '/products';
    this.route.navigate(['/products']);
  }

  signout() {
    this.localstorageservice.removeLocalStorageData();
    this.route.navigate(['login']);
  }
}
