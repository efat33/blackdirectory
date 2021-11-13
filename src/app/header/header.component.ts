import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user/user.service';
import { Observable, of, Subscription } from 'rxjs';
import { MenuItems, ProfileMenus } from './menu-items';
import { HelperService } from '../shared/helper.service';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { filter, map, mapTo, mergeMapTo, pluck, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuItems = MenuItems;
  profileMenus: any[] = ProfileMenus;
  showMobileMenu:boolean = false;

  subscriptions: Subscription = new Subscription();

  dialogRefReg: any;
  dialogRefLogin: any;
  dialogRefForgotPass: any;

  isLoggedIn: boolean = false;
  profileImage: string;
  isCartVisible$: Observable<boolean> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    pluck<Event, string>('url'),
    map((url) => !['/shop/cart', '/shop/checkout'].includes(url))
  );

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private helperService: HelperService,
    private router: Router
  ) {}

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

    // const subClickedRegisterLinkModal = this.userService.clickedRegisterLinkModal.subscribe(() => {
    //   if(this.dialogRefLogin) this.dialogRefLogin.close();
    //   if(this.dialogRefForgotPass) this.dialogRefForgotPass.close();
    //   this.openRegistrationModal();
    // });

    // this.subscriptions.add(subClickedRegisterLinkModal);
  }

  logUserOut(): void {
    this.userService.logout();
  }

  openForgotPassModal(): void {
    this.userService.onForgotPassLinkModal.emit();
  }

  openRegistrationModal(): void {
    this.userService.onRegisterLinkModal.emit();
  }

  openLoginModal(): void {
    this.userService.onLoginLinkModal.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
