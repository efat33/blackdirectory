import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { FinanceService } from '../finance.service';

declare const google: any;

@Component({
  selector: 'app-finance-lists',
  templateUrl: './finance-lists.component.html',
  styleUrls: ['./finance-lists.component.scss'],
})
export class FinanceListsComponent implements OnInit {
  siteUrl: any;
  subscriptions: Subscription = new Subscription();

  eventSearchForm: FormGroup;
  showError = false;
  errorMessage = '';

  finance: any = [];
  ads: any = [];

  totalItems = 0;

  queryParams = {
    title: '',
    limit: 12,
    offset: 0,
    page: 1,
  };
  pagination = {
    totalItems: 0,
    currentPage: 1,
    pageSize: this.queryParams.limit,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    pages: [],
  };

  locationModified = false;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    public financeService: FinanceService,
    public spinnerService: SpinnerService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    this.getFinance();

    this.ads.push('one');
    this.ads.push('two');
    this.ads.push('three');
  }



  getFinance(page: number = 1) {
    this.queryParams.page = page;
    this.queryParams.offset = (page - 1) * this.queryParams.limit;

    this.spinnerService.show();
    
    const subsSearchEvent = this.financeService.getFinanceByQuery(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();
        
        this.finance = res.data.finance;  
        this.totalItems = res.data.total_finance;

      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsSearchEvent);
  }

  onPageChange(newPage: number) {
    this.getFinance(newPage);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  
}
