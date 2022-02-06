import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'contact-employer-modal',
  templateUrl: 'contact-employer-modal.html',
  styleUrls: ['contact-employer-modal.scss'],
})
export class ContactEmployerModal implements OnInit {
  contactEmployerForm: FormGroup;
  showError = false;
  errorMessage = '';

  employer: any;
  job: any;

  constructor(
    public dialogRef: MatDialogRef<ContactEmployerModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService,
    private snackbar: SnackBarService
  ) {
    this.employer = data.to;
    this.job = data.job;
  }

  ngOnInit(): void {
    this.contactEmployerForm = new FormGroup({
      subject: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.sendEmail();
    this.dialogRef.close();
  }

  sendEmail() {
    const candidate = this.helperService.currentUserInfo;

    const emailOptions = {
      to: this.employer.email,
      subject: 'Black Directory - Job Inquiry',
      body: `Hello ${this.employer.display_name},

The below inquiry has been submitted by <a href='${location.origin}/user-details/${candidate.username}'>${candidate.display_name}</a> (${candidate.email}) for your job "<a href='${location.origin}/jobs/details/${this.job.slug}'>${this.job.title}</a>".

Subject: ${this.contactEmployerForm.value.subject}
Message:
${this.contactEmployerForm.value.message}

Best regards,

Black Directory Team`,
    };

    this.helperService.sendMail(emailOptions).subscribe();
    this.snackbar.openSnackBar('Email Sent');
  }
}
