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
import { SendMessageModalComponent } from 'src/app/modals/job/send-message/send-message-modal';
import { InformationDialogComponent } from 'src/app/modals/information-dialog/information-dialog';
import { UserService } from 'src/app/user/user.service';
import { SendEmailModalComponent } from 'src/app/modals/send-email/send-email-modal';

@Component({
  selector: 'app-all-applicants',
  templateUrl: './all-applicants.component.html',
  styleUrls: ['./all-applicants.component.css'],
})
export class AllApplicantsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  searchString: string = '';

  jobApplications = [];
  totalApplications: number = 0;
  rejectedApplications: number = 0;
  shortlistedApplications: number = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private jobService: JobService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService,
    private dialog: MatDialog,
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

    this.subscriptions.add(getApplicationSubscriptions);
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

          this.updateTotalCount();
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

    this.subscriptions.add(updateApplicationSubscription);
  }

  updateTotalCount() {
    this.totalApplications = 0;
    this.shortlistedApplications = 0;
    this.rejectedApplications = 0;

    this.jobApplications.forEach((group) => {
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

  sendMessage(application: any) {
    const dialogConfig = {
      width: '400px',
      data: {
        toUser: application.user.id,
        fromUser: application.employer_id
      },
    };

    this.dialog.open(SendMessageModalComponent, dialogConfig);
  }

  viewCoverLetter(jobApplication: any) {
    this.dialog.open(InformationDialogComponent, {
      minWidth: '35vw',
      data: { title: 'Cover Letter', message: jobApplication.cover_letter },
    });
  }

  downloadCV(jobApplication: any) {
    this.spinnerService.show();
    const subscription = this.userService.getCandidateCV(jobApplication.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        const extension = result.type === 'application/pdf' ? 'pdf' : 'doc';
        const downloadURL = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = `CV_${jobApplication.user.display_name}.${extension}`;
        link.click();
      },
      (error) => {
        this.spinnerService.hide();

        try {
          error.error.text().then((response: any) => {
            const message = JSON.parse(response)?.message;
            this.snackbar.openSnackBar(message, 'Close', 'warn');
          });
        } catch (error) {
          this.snackbar.openSnackBar('Something went wrong', 'Close', 'warn');
        }
      }
    );

    this.subscriptions.add(subscription);
  }

  sendEmail(jobApplication: any) {
    this.dialog.open(SendEmailModalComponent, {
      minWidth: '35vw',
      data: { to: jobApplication.user.email },
    });
  }

  onSubmit() {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
