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
import { ForgotPasswordModal } from '../forgot-password/forgot-password-modal';
import { RegistrationModal } from '../registration/registration-modal';

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
    private auth: AngularFireAuth,
    private database: AngularFireDatabase,
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

        this.closeDialog(result.message);
        // this.firebaseSignIn(result);
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

  firebaseSignIn(result: any) {
    this.auth
      .signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then((userCredential) => {
        this.closeDialog(result.message);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          this.firebaseSignUp(result);
        } else {
          this.closeDialog(result.message);
        }
      });
  }

  firebaseSignUp(result: any) {
    this.auth
      .createUserWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const update = { [user.uid]: result.data.id };

        this.database
          .object('users')
          .update(update)
          .then(() => {
            this.closeDialog(result.message);
          })
          .catch((error) => {
            this.closeDialog(result.message);
          });
      })
      .catch((error) => {
        this.closeDialog(result.message);
      });
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
    this.dialogRefForgotPass = this.dialog.open(ForgotPasswordModal, {
      width: '400px',
    });
  }

  openRegistrationModal(): void {
    this.dialogRefReg = this.dialog.open(RegistrationModal, {
      width: '400px',
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
