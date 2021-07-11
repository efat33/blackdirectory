import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-applied-jobs',
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.css'],
})
export class AppliedJobsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  internalJobs: any = [];
  emailJobs: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.spinnerService.show();
    const getJobsSubscription = this.jobService.getAppliedJobs().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.internalJobs = result.data.internal;
        this.emailJobs = result.data.email;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(getJobsSubscription);
  }

  getUserProfilePicture(job: any) {
    if (job.employer_profile_photo) {
      return this.helperService.getImageUrl(job.employer_profile_photo, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
