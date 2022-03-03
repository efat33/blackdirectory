import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'email-job-modal',
  templateUrl: 'email-job-modal.html',
  styleUrls: ['email-job-modal.scss'],
})
export class EmailJobModalComponent implements OnInit {
  emailJobForm: FormGroup;
  showError = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<EmailJobModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.emailJobForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.sendEmail();
    this.dialogRef.close();
  }

  sendEmail() {
    const jobUrl = `${window.location.origin}/jobs/details/${this.data.job.slug}`;
    const emailBody = `Hello ${this.emailJobForm.value.name},

Here is a job that you may like.
Job Link: <a href='${jobUrl}'>${this.data.job.title}</a>

Kind regards,

Black Directory`;

    const emailOptions = {
      to: this.emailJobForm.value.email,
      subject: 'Check this job out!',
      body: emailBody,
    };

    this.helperService.sendMail(emailOptions).subscribe();
    this.snackbar.openSnackBar('Email Sent');
  }
}
