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
  progressResume: number = 0;

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
    private uploadService: UploadService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.job = this.data.job;

    this.jobApplyForm = new FormGroup({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      email: new FormControl('', Validators.required),
      phone: new FormControl(''),
      job_title: new FormControl(''),
      current_salary: new FormControl(''),
      academics: new FormControl('', Validators.required),
      age: new FormControl(''),
      industry: new FormControl(''),
      gender: new FormControl(''),
      resume: new FormControl(''),
      message: new FormControl(''),
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


  onResumeChange(event: any) {
    // reset validation
    this.formCustomvalidation.resume.validated = true;
    this.formCustomvalidation.resume.message = '';

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.fileValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.resume.validated = false;
        this.formCustomvalidation.resume.message = res.message;
        return;
      }

      // send image to the server
      const fd = new FormData();
      fd.append('file', file, file.name);

      this.uploadService.uploadFile(fd, 'job').subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progressResume = Math.round((event.loaded / event.total) * 100);
              break;
            case HttpEventType.Response:
              // check for validation
              if (event.body.data.fileValidationError) {
                this.formCustomvalidation.resume.validated = false;
                this.formCustomvalidation.resume.message = event.body.data.fileValidationError;
              } else {
                this.jobApplyForm.get('resume').patchValue(event.body.data.filename);
              }

              // hide progress bar
              setTimeout(() => {
                this.progressResume = 0;
              }, 1500);
          }
        },
        (res: any) => {
          console.log(res);
        }
      );
    }
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
phone: ${this.jobApplyForm.value.phone}
job_title: ${this.jobApplyForm.value.job_title}
current_salary: ${this.jobApplyForm.value.current_salary}
academics: ${this.jobApplyForm.value.academics.join(', ')}
age: ${this.jobApplyForm.value.age}
industry: ${this.jobApplyForm.value.industry}
gender: ${this.jobApplyForm.value.gender}
message: ${this.jobApplyForm.value.message}

Best regards,

Black Directory Team`;

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
