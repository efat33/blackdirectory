import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class UserFollowingComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  followings: any = [];

  constructor(
    private userService: UserService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getFollowingEmployers();
  }

  getFollowingEmployers() {
    this.spinnerService.show();
    const subscription = this.userService.getFollowingEmployers().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.followings = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  unfollow(followingEmployer: any, index: number) {
    if (!this.helperService.currentUserInfo) {
      this.snackbar.openSnackBar('Requires login', 'Close', 'warn');
      return;
    }

    this.spinnerService.show();

    const subscription = this.userService.unfollowEmployer(followingEmployer.employer_id).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar('Employer unfollowed');

        this.followings.splice(index, 1);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getUserProfilePicture(followingEmployer: any) {
    if (followingEmployer.employer_profile_photo) {
      return this.helperService.getImageUrl(followingEmployer.employer_profile_photo, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
