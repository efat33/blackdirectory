import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordModal } from './modals/user/forgot-password/forgot-password-modal';
import { LoginModal } from './modals/user/login/login-modal';
import { RegistrationModal } from './modals/user/registration/registration-modal';
import { ResetPasswordModal } from './modals/user/reset-password/reset-password-modal';
import { HelperService } from './shared/helper.service';
import { WishlistService } from './shared/services/wishlist.service';
import { SpinnerService } from './shared/spinner.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'blackdirectory';

  showLoadingSpinner = false;

  constructor(
    public helperService: HelperService,
    private spinnerService: SpinnerService,
    private cdk: ChangeDetectorRef,
    private userService: UserService,
    private dialog: MatDialog,
    private wishlistService: WishlistService,
    private auth: AngularFireAuth,
    private database: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.spinnerService.status.subscribe((val: boolean) => {
      this.showLoadingSpinner = val;
      this.cdk.detectChanges();
    });

    this.checkAuthentication();
    this.registerAuthEvents();
    this.firebaseSignIn();
  }

  firebaseSignIn() {
    const userInfo = JSON.parse(localStorage.getItem('firebase'));

    if (!userInfo) {
      return;
    }

    this.auth
      .signInWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((userCredential) => {
        localStorage.removeItem('firebase');
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          this.firebaseSignUp(userInfo);
        } else {
          localStorage.removeItem('firebase');
        }
      });
  }

  firebaseSignUp(userInfo: any) {
    this.auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const update = { [user.uid]: userInfo.id };

        this.database
          .object('users')
          .update(update)
          .then(() => {
            localStorage.removeItem('firebase');
          })
          .catch((error) => {
            localStorage.removeItem('firebase');
          });
      })
      .catch((error) => {
        localStorage.removeItem('firebase');
      });
  }

  checkAuthentication() {
    // check if the user is logged in
    this.userService.isAuthenticated().then(
      (res) => {
        // set current user to localstorage
        localStorage.setItem('currentUserInfo', JSON.stringify(res.data));
        this.helperService.setCurrentUserInfo();

        if (res.data) {
          this.wishlistService.setProducts();
        }
      },
      (res) => {
        // remove user data from localstorage
        localStorage.removeItem('currentUserInfo');
      }
    );
  }

  registerAuthEvents() {
    this.userService.onLoginLinkModal.subscribe(() => {
      this.openLoginModal();
    });

    this.userService.onRegisterLinkModal.subscribe(() => {
      this.openRegistrationModal();
    });

    this.userService.onForgotPassLinkModal.subscribe(() => {
      this.openForgotPassModal();
    });

    this.userService.onResetPassLinkModal.subscribe(() => {
      this.openResetPasswordModal();
    });
  }

  openForgotPassModal(): void {
    this.dialog.open(ForgotPasswordModal, {
      width: '400px',
    });
  }

  openRegistrationModal(): void {
    this.dialog.open(RegistrationModal, {
      width: '400px',
    });
  }

  openLoginModal(): void {
    this.dialog.open(LoginModal, {
      width: '400px',
    });
  }

  openResetPasswordModal(): void {
    this.dialog.open(ResetPasswordModal, {
      width: '400px',
    });
  }

  onActivate(event: Event) {
    window.scrollTo(0, 0);
  }
}
