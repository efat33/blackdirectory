import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { InformationDialogComponent } from 'src/app/modals/information-dialog/information-dialog';
import { SendMessageModalComponent } from 'src/app/modals/job/send-message/send-message-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

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
    private ref: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private jobService: JobService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private dialog: MatDialog
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

  sendMessage(application: any) {
    const dialogConfig = {
      width: '400px',
      data: {
        candidateId: application.user.id,
        employerId: application.employer_id,
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
