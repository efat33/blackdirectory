import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'login-modal',
  templateUrl: 'login-modal.html',
  styleUrls: ['login-modal.css'],
})
export class LoginModal implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showError = false;
  errorMessage: string[];
  subscriptions = new Subscription();

  dialogRefReg: any;
  dialogRefForgotPass: any;

  constructor(
    public dialogRef: MatDialogRef<LoginModal>,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
    public dialog: MatDialog
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.loginForm.valueChanges.subscribe((x) => {
      this.emptyErrorMsg();
    });
  }

  onSubmit() {
    // empty existing error messages
    this.emptyErrorMsg();

    this.spinnerService.show();
    const subscriptionLoginUser = this.userService.loginUser(this.loginForm.value).subscribe(
      (result: any) => {
        // set current user to localstorage
        localStorage.setItem('currentUserInfo', JSON.stringify(result.data));

        const firebaseUserInfo = {
          id: result.data.id,
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        };

        localStorage.setItem('firebase', JSON.stringify(firebaseUserInfo));

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
    this.spinnerService.hide();

    // close login modal
    this.dialogRef.close();

    // redirect user to dashboard
    // this.router.navigate(['dashboard']);

    location.reload();
    // show successful message
    this.snackbar.openSnackBar(message);
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

  forgotPasswordClicked() {
    // close login modal first
    this.dialogRef.close();

    this.openForgotPassModal();
  }

  openForgotPassModal(): void {
    this.userService.onForgotPassLinkModal.emit();
  }

  openRegistrationModal(): void {
    this.userService.onRegisterLinkModal.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
