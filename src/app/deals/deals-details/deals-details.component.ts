import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { DealsService } from '../deals.service';

@Component({
  selector: 'app-deals-details',
  templateUrl: './deals-details.component.html',
  styleUrls: ['./deals-details.component.scss'],
})
export class DealDetailsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  deal: any;
  dealSlug: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dealService: DealsService,
    private snackbar: SnackBarService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.dealSlug = this.route.snapshot.paramMap.get('deal-slug');

      this.getDeal();
    });
  }

  getDeal() {
    this.spinnerService.show();
    const subscription = this.dealService.getDeal(this.dealSlug).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.deal = result.data[0];
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
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
