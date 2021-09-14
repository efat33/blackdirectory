import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-manage-jobs',
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.css'],
})
export class ManageJobsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  jobs: any = [];
  searchKeyword: string = '';

  currentPackage: any;
  featuredJobCount: number = 0;

  constructor(
    private router: Router,
    private jobService: JobService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getUserJobs();
    this.getCurrentPackage();
  }

  getUserJobs() {
    this.spinnerService.show();

    const getJobsSubscription = this.jobService.getUserJobs().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.jobs = result.data;
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getJobsSubscription);
  }

  getCurrentPackage() {
    this.spinnerService.show();
    const subscription = this.jobService.getCurrentPackage().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.currentPackage = result.data.currentPackage;
        this.featuredJobCount = result.data.jobs?.filter((job: any) => job.featured).length;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  matchSearch(job: any) {
    return job.title.toLowerCase().includes(this.searchKeyword.toLowerCase());
  }

  featureJob(job: any) {
    if (!job.featured && !this.helperService.isAdmin()) {
      if (!this.currentPackage) {
        this.router.navigate(['dashboard/packages']);
        return;
      }

      if (this.featuredJobCount >= this.currentPackage.featured_jobs) {
        this.router.navigate(['dashboard/packages']);
        return;
      }
    }

    this.spinnerService.show();
    const featureJobSubs = this.jobService.updateJobProperty(job.id, { featured: !job.featured }).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        job.featured = !job.featured;

        if (job.featured) {
          this.featuredJobCount++;
        } else {
          this.featuredJobCount--;
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(featureJobSubs);
  }

  fillJob(job: any) {
    this.spinnerService.show();
    const filledJobSubs = this.jobService.updateJobProperty(job.id, { filled: !job.filled }).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        job.filled = !job.filled;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(filledJobSubs);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
