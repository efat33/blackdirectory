import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-manage-jobs',
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.css'],
})
export class ManageJobsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  jobs: any = [];
  searchKeyword: string = '';

  constructor(
    private jobService: JobService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getUserJobs();
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

    this.subsciptions.add(getJobsSubscription);
  }

  matchSearch(job: any) {
    return job.title.toLowerCase().includes(this.searchKeyword.toLowerCase());
  }

  featureJob(job: any) {
    this.spinnerService.show();

    const featureJobSubs = this.jobService.updateJobProperty(job.id, {featured: !job.featured}).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        job.featured = !job.featured;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(featureJobSubs);
  }

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
