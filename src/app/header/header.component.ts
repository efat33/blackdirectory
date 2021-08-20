import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { RegistrationModal } from '../modals/user/registration/registration-modal';
import { LoginModal } from '../modals/user/login/login-modal';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { MenuItems, ProfileMenus } from './menu-items';
import { HelperService } from '../shared/helper.service';
import { ForgotPasswordModal } from '../modals/user/forgot-password/forgot-password-modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuItems = MenuItems;
  profileMenus: any[] = ProfileMenus;

  subscriptions: Subscription = new Subscription();

  dialogRefReg: any;
  dialogRefLogin: any;
  dialogRefForgotPass: any;

  isLoggedIn: boolean = false;
  profileImage: string;

  constructor(public dialog: MatDialog, private userService: UserService, private helperService: HelperService) {}

  ngOnInit() {
    if (this.helperService.isUserLoggedIn()) {
      this.isLoggedIn = true;
    }

    if (this.helperService.isAdmin()) {
      this.profileMenus.unshift({
        title: 'Admin',
        route: 'admin',
      });
    }

    if (this.helperService.isUserLoggedIn() && this.helperService.currentUserInfo.profile_photo) {
      this.profileImage = this.helperService.getImageUrl(
        this.helperService.currentUserInfo.profile_photo,
        'users',
        'thumb'
      );
    }

    const subClickedRegisterLinkModal = this.userService.clickedRegisterLinkModal.subscribe(() => {
      this.dialogRefLogin.close();
      this.openRegistrationModal();
    });

    this.subscriptions.add(subClickedRegisterLinkModal);

    const subsclickedLoginLinkModal = this.userService.clickedLoginLinkModal.subscribe(() => {
      this.dialogRefReg.close();
      this.openLoginModal();
    });

    this.subscriptions.add(subsclickedLoginLinkModal);

    const subClickedForgotPassLinkModal = this.userService.clickedForgotPassLinkModal.subscribe(() => {
      this.dialogRefLogin.close();
      this.openForgotPassModal();
    });

    this.subscriptions.add(subClickedForgotPassLinkModal);
  }

  logUserOut(): void {
    this.userService.logout();
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

  openLoginModal(): void {
    this.dialogRefLogin = this.dialog.open(LoginModal, {
      width: '400px',
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
