import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'forgot-password-modal',
  templateUrl: 'forgot-password-modal.html',
  styleUrls: ['forgot-password-modal.css'],
})
export class ForgotPasswordModal implements OnInit, OnDestroy {
  forgotPassForm: FormGroup;
  showError = false;
  errorMessage: string[];
  subscriptions = new Subscription();

  dialogRefReg: any;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordModal>,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
    public dialog: MatDialog,
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPassForm.controls;
  }

  ngOnInit(): void {
    this.forgotPassForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.forgotPassForm.valueChanges.subscribe((x) => {
      this.emptyErrorMsg();
    });
  }

  onSubmit() {
    // empty existing error messages
    this.emptyErrorMsg();

    this.spinnerService.show();
    const subscriptionLoginUser = this.userService.forgotPassword(this.forgotPassForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.closeDialog(result.message);
      },
      (result: any) => {
        if (result.error.errors) {
          for (const iterator of result.error.errors) {
            this.errorMessage.push(iterator.msg);
          }
        } else {
          this.errorMessage.push(result.error.message);
        }

        this.showError = true;
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subscriptionLoginUser);
  }



  closeDialog(message: string) {
    // close forgot password modal
    this.dialogRef.close();

    // open reset password modal
    this.userService.onResetPassLinkModal.emit();
  }

  emptyErrorMsg() {
    this.showError = false;
    this.errorMessage = [];
  }

  registerClicked() {
    // close login modal first
    this.dialogRef.close();

    this.openRegistrationModal();
  }

  openRegistrationModal(): void {
    this.userService.onRegisterLinkModal.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
