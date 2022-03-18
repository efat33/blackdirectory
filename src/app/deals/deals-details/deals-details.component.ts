import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SeoService } from 'src/app/shared/services/seo.service';
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
    private helperService: HelperService,
    private snackbar: SnackBarService,
    private spinnerService: SpinnerService,
    private seo: SeoService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.dealSlug = this.route.snapshot.paramMap.get('deal-slug');

      this.getDeal();
    });
  }

  setSeoData(sData) {
    this.seo.generateTags({
      title: sData.meta_title || this.deal.title, 
      description: sData.meta_desc || '', 
      image: this.helperService.getImageUrl(sData.image, 'deal', 'medium') || this.helperService.defaultSeoImage,
      slug: `deals/details/${this.dealSlug}`,
      keywords: sData.meta_keywords || '',
    });
  }

  getDeal() {
    this.spinnerService.show();
    const subscription = this.dealService.getDeal(this.dealSlug).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.deal = result.data[0];

        this.setSeoData(this.deal);
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
