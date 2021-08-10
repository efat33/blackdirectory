import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { MobilesService } from '../mobiles.service';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper/core';
import { SpinnerService } from 'src/app/shared/spinner.service';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-mobiles-landing',
  templateUrl: './mobiles-landing.component.html',
  styleUrls: ['./mobiles-landing.component.scss'],
})
export class MobilesLandingComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  latestDeals: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private mobilesService: MobilesService,
    private snackbar: SnackBarService,
    private helperService: HelperService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.getLatestDeals();
  }

  getLatestDeals() {
    this.spinnerService.show();
    const subscription = this.mobilesService.getMobiles({ limit: 8 }).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.latestDeals = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  isUnlimited(value: any) {
    return value === this.mobilesService.unlimitedNumber;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
