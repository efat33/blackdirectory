import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobService } from 'src/app/jobs/jobs.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { UserService } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'jobapply-email-modal',
  templateUrl: 'jobapply-email-modal.html',
  styleUrls: ['jobapply-email-modal.scss'],
})
export class JobApplyEmailModal implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  job: any;

  jobApplyForm: FormGroup;
  showError = false;
  errorMessage = '';

  formCustomvalidation = {
    resume: {
      validated: true,
      message: '',
    },
  };

  // convenience getter for easy access to form fields
  get f() {
    return this.jobApplyForm.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<JobApplyEmailModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public jobService: JobService,
    public userService: UserService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.job = this.data.job;

    this.jobApplyForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl(''),
      message: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (!this.job.job_meta?.job_apply_email) {
      this.snackbar.openSnackBar('Something went wrong', 'Close', 'warn');
      return;
    }

    const body = {
      job_id: this.job.id,
      employer_id: this.job.user_id,
    };

    this.spinnerService.show();
    const newJobSubscription = this.jobService.newJobApplication(body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.sendEmail();
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newJobSubscription);
  }

  sendEmail() {
    const emailOptions = this.prepareEmailOptions();

    this.jobService.sendMail(emailOptions).subscribe(
      (result: any) => {
      },
      (error) => {
      }
    );
  }

  prepareEmailOptions() {
    const emailBody = `Hi ${this.job.user.display_name},

You have recieved a new application for your job "<a href='${location.origin}/jobs/details/${this.job.slug}'>${this.job.title}</a>".

First Name: ${this.jobApplyForm.value.first_name}
Last Name: ${this.jobApplyForm.value.last_name}
Email: ${this.jobApplyForm.value.email}
Phone: ${this.jobApplyForm.value.phone}

Message: ${this.jobApplyForm.value.message}

Kind regards,

Black Directory`;

    const options = {
      to: this.job.job_meta.job_apply_email,
      subject: 'Black Directory - Job Application',
      body: emailBody,
      resume: this.jobApplyForm.value.resume
    };

    return options;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
