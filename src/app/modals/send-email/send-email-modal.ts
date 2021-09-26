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

  constructor(
    public dialogRef: MatDialogRef<SendEmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService,
    private snackbar: SnackBarService,
  ) {}

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
    const emailOptions = {
      to: this.data.to,
      subject: this.emailForm.value.subject,
      body: this.emailForm.value.message,
    };

    this.helperService.sendMail(emailOptions).subscribe();
    this.snackbar.openSnackBar('Email Sent');
  }
}
