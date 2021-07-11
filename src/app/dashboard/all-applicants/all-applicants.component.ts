import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import * as lodash from 'lodash';
import { HelperService } from 'src/app/shared/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-applicants',
  templateUrl: './all-applicants.component.html',
  styleUrls: ['./all-applicants.component.css'],
})
export class AllApplicantsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  searchString: string = '';

  jobApplications = [];
  totalApplications: number = 0;
  rejectedApplications: number = 0;
  shortlistedApplications: number = 0;

  constructor(
    private router: Router,
    private jobService: JobService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getJobApplications();
  }

  getJobApplications() {
    this.spinnerService.show();
    const getApplicationSubscriptions = this.jobService.getJobApplications().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.jobApplications = this.processJobApplications(result.data);

        this.updateTotalCount();
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(getApplicationSubscriptions);
  }

  processJobApplications(applications: any) {
    const proccessedApplications = [];
    let groupedApplications: any = lodash.groupBy(applications, (application) => application.job.id);
    groupedApplications = Object.values(groupedApplications);

    const sortedGroups = lodash.orderBy(
      groupedApplications,
      (group) => {
        const maxCreatedDate = lodash.maxBy(group, (application: any) => application.created_at);
        return new Date(maxCreatedDate.created_at);
      },
      ['desc']
    );

    for (let group of sortedGroups) {
      proccessedApplications.push({
        job_title: group[0].job.title,
        applications: group,
        totalApplications: () => group.length,
        shortlistedApplications: () => group.filter((application: any) => application.shortlisted).length,
        rejectedApplications: () => group.filter((application: any) => application.rejected).length,
      });
    }

    return proccessedApplications;
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

          this.updateTotalCount();
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

    this.subsciptions.add(updateApplicationSubscription);
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

          this.updateTotalCount();
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

    this.subsciptions.add(updateApplicationSubscription);
  }

  updateTotalCount() {
    this.totalApplications = 0;
    this.shortlistedApplications = 0;
    this.rejectedApplications = 0;

    this.jobApplications.forEach(group => {
      group.applications.forEach((application: any) => {
        this.totalApplications++;

        if (application.shortlisted) {
          this.shortlistedApplications++;
        }

        if (application.rejected) {
          this.rejectedApplications++;
        }
      });
    });
  }

  onSubmit() {}

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
