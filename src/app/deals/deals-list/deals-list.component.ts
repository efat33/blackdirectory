import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { DealsService } from '../deals.service';

@Component({
  selector: 'app-deals-list',
  templateUrl: './deals-list.component.html',
  styleUrls: ['./deals-list.component.scss'],
})
export class DealsListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  pageHeadline: string = 'Deals';
  dealerSlug: string;

  deals = [];

  totalItems: number = 0;
  dealsPerPage: number = 12;
  page: number = 1;

  filter: any = {
    dealer_slug: '',
    title: '',
  };

  constructor(
    private route: ActivatedRoute,
    private dealsService: DealsService,
    private snackbar: SnackBarService,
    private helperService: HelperService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.dealerSlug = this.route.snapshot.paramMap.get('dealer-slug');

    if (this.dealerSlug) {
      this.filter.dealer_slug = this.dealerSlug;
    }

    this.getAllDeals();
  }

  getAllDeals(page: number = null) {
    this.getDeals(page);
    this.getTotalDeals();
  }

  getDeals(page: number = null) {
    this.spinnerService.show();
    const subscription = this.dealsService.getDeals(this.filter, page || this.page, this.dealsPerPage).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.deals = result.data;
        this.page = page;

        if (this.dealerSlug) {
          this.pageHeadline = `${this.deals[0]?.dealer_name} Deals`;
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getTotalDeals() {
    this.spinnerService.show();
    const subscription = this.dealsService.getDeals(this.filter, null, null, true).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.totalItems = result.data[0].count;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  onPageChange(newPage: number) {
    this.getDeals(newPage);

    window.scroll(0, 0);
  }

  copyDiscount(deal: any, tooltip: MatTooltip) {
    tooltip.disabled = false;
    tooltip.show();

    setTimeout(() => {
      tooltip.disabled = true;
      tooltip.hide();
    }, 2000);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
