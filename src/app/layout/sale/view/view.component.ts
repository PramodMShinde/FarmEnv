import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageDialogService } from 'src/app/services/message-dialog.service';
import { ApicallService } from '../../../services/apicall.service';
import { Constants, ErrorMessageConstants } from 'src/app/shared/constants/constants';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public params: any = {};
  public sale: any = {};
  public SaleIdentifier = 0;
  public DataFormat = '';

  public salesprdlist = [];
  public array: any;
  public pageNo = 0;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public TotalProductSalesAmount = 0;
  displayedColumns: string[] = ['prdname', 'qty', 'uom', 'salerate', 'totalamt'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
  }

  constructor(private _location: Location,
    private uiLoader: NgxUiLoaderService,
    private _messageDialogService: MessageDialogService,
    private router: Router,
    private injector: Injector,
    private apicallservice: ApicallService) {

      router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          if (e.url.includes('/sales')) {
            //set passing parameters to localstorage.
            if (localStorage.getItem('saleViewRouteparams')) {
              this.params = JSON.parse(localStorage.getItem('saleViewRouteparams'));
              this.SaleIdentifier = this.params.Routeparams.passingparams.Identifier
            }
          }
          else {
            localStorage.removeItem("saleViewRouteparams");
          }
        }
      });
    }

  ngOnInit() {
    this.DataFormat = localStorage.getItem('DateFormat');
    this.getSaleDetails();
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
      this.sale = response.list[0];
      this.salesprdlist = this.sale.SaleProducts;
      this.dataSource = new MatTableDataSource<any>(this.salesprdlist);
      this.dataSource.sort = this.sort;
      this.array = this.salesprdlist;

      this.salesprdlist.forEach(i => {
        this.TotalProductSalesAmount = this.TotalProductSalesAmount + i.TotalAmount;
      });
    }
  }

  updateBtnClicked() {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": this.sale.Identifier,
        }
      }
    }
    localStorage.setItem("saleEditRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['sales', 'Add']);
  }

  deleteBtnClicked() {
    let message = 'Are you sure, you want to delete this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(this.sale);
        let isDeleted = await this.apicallservice.deleteSale(data);
        if (isDeleted) {
          let messageString = Constants.recordDeletedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          const router = this.injector.get(Router);
          router.navigate(['sales']);
        }
      }
    });
  }

  cancelBtnClicked() {
    const router = this.injector.get(Router);
    router.navigate(['sales']);
  }

}
