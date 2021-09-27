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

  constructor(
    public dialogRef: MatDialogRef<ContactEmployerModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService,
    private snackbar: SnackBarService
  ) {}

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
    const emailOptions = {
      to: this.data.to,
      subject: this.contactEmployerForm.value.subject,
      body: this.contactEmployerForm.value.message,
    };

    this.helperService.sendMail(emailOptions).subscribe();
    this.snackbar.openSnackBar('Email Sent');
  }
}
