import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-job-packages',
  templateUrl: './job-packages.component.html',
  styleUrls: ['./job-packages.component.scss'],
})
export class JobPackagesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  packages: any[] = [];
  currentPackage: any = null;
  currentPackagePrice: any = {};

  jobsPosted: number = 0;
  featuredJobs: number = 0;
  cvDownload: number = 0;

  purchaseDate: Date = new Date();
  expiryDate: Date = new Date();

  constructor(
    private router: Router,
    private jobService: JobService,
    private userService: UserService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getPackages();
  }

  getPackages() {
    this.spinnerService.show();
    const subscription = this.jobService.getJobPackages().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.packages = result.data;

        for (const jobPackage of this.packages) {
          jobPackage.selectedPrice = jobPackage.prices[0];
        }

        this.getCurrentPackage();
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getCurrentPackage() {
    this.spinnerService.show();
    const subscription = this.jobService.getCurrentPackage().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        const currentPackageId = result.data.meta_values.find((value: any) => value.meta_key === 'package')?.meta_value;
        const currentPackagePriceId = result.data.meta_values.find(
          (value: any) => value.meta_key === 'package_price'
        )?.meta_value;

        this.purchaseDate = result.data.meta_values.find(
          (value: any) => value.meta_key === 'package_purchase_date'
        )?.meta_value;
        this.expiryDate = result.data.meta_values.find(
          (value: any) => value.meta_key === 'package_expire_date'
        )?.meta_value;

        this.cvDownload = result.data.meta_values.find(
          (value: any) => value.meta_key === 'cv_download'
        )?.meta_value || 0;

        if (currentPackageId) {
          this.currentPackage = this.packages.find((jobPackage: any) => jobPackage.id === parseInt(currentPackageId));
          this.currentPackagePrice = this.currentPackage.prices.find(
            (price: any) => price.id === parseInt(currentPackagePriceId)
          );
        } else {
          this.currentPackage = this.packages.find((jobPackage: any) => jobPackage.title === 'Free');
          this.currentPackagePrice = this.currentPackage.prices[0];
        }

        this.jobsPosted = result.data.jobs?.length || 0;
        this.featuredJobs = result.data.jobs?.filter((job: any) => job.featured).length || 0;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  buyPackage(jobPackage: any) {
    const body = {
      packageId: jobPackage.id,
      priceId: jobPackage.selectedPrice.id,
      returnUrl: 'http://localhost:4200/dashboard/packages/return',
    };

    this.spinnerService.show();
    const subscription = this.jobService.createStripeCheckoutSession(body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (result.data?.url) {
          window.location.href = result.data.url;
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
