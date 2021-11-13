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
  selector: 'reset-password-modal',
  templateUrl: 'reset-password-modal.html',
  styleUrls: ['reset-password-modal.css'],
})
export class ResetPasswordModal implements OnInit, OnDestroy {
  resetPassForm: FormGroup;
  showError = false;
  errorMessage: string[];
  subscriptions = new Subscription();

  passwordUpdated:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordModal>,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
    public dialog: MatDialog,
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPassForm.controls;
  }

  ngOnInit(): void {
    this.resetPassForm = new FormGroup({
      reset_key: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,})'),
      ]),
      con_password: new FormControl('', Validators.required),
    });

    this.resetPassForm.valueChanges.subscribe((x) => {
      this.emptyErrorMsg();
    });
  }

  onSubmit() {
    // empty existing error messages
    this.emptyErrorMsg();

    this.spinnerService.show();
    const subscriptionResetPassword = this.userService.resetPassword(this.resetPassForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(result.message);

        this.passwordUpdated = true;
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

    this.subscriptions.add(subscriptionResetPassword);
  }


  emptyErrorMsg() {
    this.showError = false;
    this.errorMessage = [];
  }

  loginClicked() {
    // close forgot password modal
    this.dialogRef.close();

    // open reset password modal
    this.userService.onLoginLinkModal.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
