import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { RegistrationModal } from '../modals/user/registration/registration-modal';
import { LoginModal } from '../modals/user/login/login-modal';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { MenuItems, ProfileMenus } from './menu-items';
import { HelperService } from '../shared/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuItems = MenuItems;
  profileMenus = ProfileMenus;
  
  subsciptions: Subscription = new Subscription();

  dialogRefReg: any;
  dialogRefLogin: any;

  isLoggedIn: boolean = false;
  profileImage: string;


  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    
    if(this.helperService.isUserLoggedIn()) this.isLoggedIn = true;

    if(this.helperService.isUserLoggedIn() && this.helperService.currentUserInfo.profile_photo != ''){
      this.profileImage = this.helperService.getImageUrl(this.helperService.currentUserInfo.profile_photo, 'users', 'thumb');
    }

    const subClickedRegisterLinkModal = this.userService.clickedRegisterLinkModal.subscribe( () => {
      this.dialogRefLogin.close();
      this.openRegistrationModal();
    });
    
    this.subsciptions.add(subClickedRegisterLinkModal);

    const subsclickedLoginLinkModal = this.userService.clickedLoginLinkModal.subscribe( () => {
      this.dialogRefReg.close();
      this.openLoginModal();
    });

    this.subsciptions.add(subsclickedLoginLinkModal);
  }

  logUserOut(): void {
    this.userService.logout();
  }

  openRegistrationModal(): void {
    this.dialogRefReg = this.dialog.open(RegistrationModal, {
      width: '400px'
    });

  }

  openLoginModal(): void {
    this.dialogRefLogin = this.dialog.open(LoginModal, {
      width: '400px'
    });

  }

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }


}
