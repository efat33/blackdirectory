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

  deleteJob(jobId: number, index: number) {
    this.spinnerService.show();

    const getJobsSubscription = this.jobService.deleteJob(jobId).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.jobs.splice(index, 1);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(getJobsSubscription);
  }

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
