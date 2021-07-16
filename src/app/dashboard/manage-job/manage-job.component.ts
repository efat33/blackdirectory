import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-manage-jobs',
  templateUrl: './manage-job.component.html',
  styleUrls: ['./manage-job.component.css'],
})
export class ManageJobComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  jobApplications: any = [];

  selectedTab = 0;

  get shortlistedApplications() {
    return this.jobApplications.filter((application: any) => application.shortlisted);
  }

  get rejectedApplications() {
    return this.jobApplications.filter((application: any) => application.rejected);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    const jobId = parseInt(this.route.snapshot.paramMap.get('job_id'));

    if (!isNaN(jobId)) {
      this.getJobApplications(jobId);
    }
  }

  getJobApplications(jobId: number) {
    this.spinnerService.show();
    const getApplicationSubscriptions = this.jobService.getJobApplications(jobId).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.jobApplications = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getApplicationSubscriptions);
  }

  getUserProfilePicture(user: any) {
    if (user.profile_photo) {
      return this.helperService.getImageUrl(user.profile_photo, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  goToUserDetails(jobApplication: any) {
    const updateApplicationSubscription = this.jobService
      .updateJobApplication(jobApplication.id, { viewed: true })
      .subscribe(
        (result: any) => {
          updateApplicationSubscription.unsubscribe();
        },
        (error) => {
          updateApplicationSubscription.unsubscribe();
        }
      );

    this.router.navigate(['/user-details/', jobApplication.user.username]);
  }

  shortlistApplication(jobApplication: any) {
    this.spinnerService.show();
    const updateApplicationSubscription = this.jobService
      .updateJobApplication(jobApplication.id, { shortlisted: !jobApplication.shortlisted })
      .subscribe(
        (result: any) => {
          this.spinnerService.hide();

          jobApplication.shortlisted = !jobApplication.shortlisted;
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

    this.subscriptions.add(updateApplicationSubscription);
  }

  rejectApplication(jobApplication: any) {
    this.spinnerService.show();
    const updateApplicationSubscription = this.jobService
      .updateJobApplication(jobApplication.id, { shortlisted: false, rejected: !jobApplication.rejected })
      .subscribe(
        (result: any) => {
          this.spinnerService.hide();

          jobApplication.shortlisted = false;
          jobApplication.rejected = !jobApplication.rejected;
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

    this.subscriptions.add(updateApplicationSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
