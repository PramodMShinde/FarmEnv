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
  public procure: any = {};
  public ProcurementIdentifier = 0;
  public DataFormat = '';

  public procurmentprdlist = [];
  public IsProcurementProductupdateCall: boolean = false;
  public oldProcurementProduct: any = {};
  public array: any;
  public pageNo = 0;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  public TotalProductProcurementAmount = 0;
  displayedColumns: string[] = ['prdname', 'qty', 'uom', 'prdrate', 'totalamt'];
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
          if (e.url.includes('/procurment')) {
            //set passing parameters to localstorage.
            if (localStorage.getItem('procViewRouteparams')) {
              this.params = JSON.parse(localStorage.getItem('procViewRouteparams'));
              this.ProcurementIdentifier = this.params.Routeparams.passingparams.Identifier
            }
          }
          else {
            localStorage.removeItem("procViewRouteparams");
          }
        }
      });
    }

  ngOnInit() {
    this.DataFormat = localStorage.getItem('DateFormat');
    this.getProcurementDetails();
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
      this.procure = response.list[0];
      this.procurmentprdlist = this.procure.ProcurementProducts;
      this.dataSource = new MatTableDataSource<any>(this.procurmentprdlist);
      this.dataSource.sort = this.sort;
      this.array = this.procurmentprdlist;

      this.procurmentprdlist.forEach(i => {
        this.TotalProductProcurementAmount = this.TotalProductProcurementAmount + i.TotalAmount;
      });

    }
  }

  updateBtnClicked() {
    let queryParams = {
      Routeparams: {
        passingparams: {
          "Identifier": this.procure.Identifier,
        }
      }
    }
    localStorage.setItem("saleEditRouteparams", JSON.stringify(queryParams))
    const router = this.injector.get(Router);
    router.navigate(['procurment', 'Add']);
  }

  deleteBtnClicked() {
    let message = 'Are you sure, you want to delete this record?';
    this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
      if (isConfirmed) {
        let data = [];
        data.push(this.procure);
        let isDeleted = await this.apicallservice.deleteSale(data);
        if (isDeleted) {
          let messageString = Constants.recordDeletedMessage;
          this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
          const router = this.injector.get(Router);
          router.navigate(['procurment']);
        }
      }
    });
  }

  cancelBtnClicked() {
    const router = this.injector.get(Router);
    router.navigate(['procurment']);
  }

}
