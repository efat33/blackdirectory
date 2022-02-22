import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'send-email-modal',
  templateUrl: 'send-email-modal.html',
  styleUrls: ['send-email-modal.scss'],
})
export class SendEmailModalComponent implements OnInit {
  emailForm: FormGroup;
  showError = false;
  errorMessage = '';

  user: any;
  job: any;

  constructor(
    public dialogRef: MatDialogRef<SendEmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService,
    private snackbar: SnackBarService,
  ) {
    this.user = data.to;
    this.job = data.job;
  }

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      subject: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.sendEmail();
    this.dialogRef.close();
  }

  sendEmail() {
    const currentUser = this.helperService.currentUserInfo;

    const emailOptions = {
      to: this.user.email,
      subject: `Black Directory - Contact Form`,
      body: `Hello ${this.user.display_name},

The below inquiry has been made by ${currentUser.display_name} via your job application for the job "<a href="${location.origin}/jobs/details/${this.job.slug}">${this.job.title}</a>".

Subject: ${this.emailForm.value.subject}
Message:
${this.emailForm.value.message}

Best regards,

Black Directory Team`,
    };

    this.helperService.sendMail(emailOptions).subscribe();
    this.snackbar.openSnackBar('Email Sent');
  }
}
