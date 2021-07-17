import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
})
export class UserFollowerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  followers: any = [];

  constructor(
    private userService: UserService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getFollowers();
  }

  getFollowers() {
    this.spinnerService.show();
    const subscription = this.userService.getFollowers().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.followers = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getUserProfilePicture(follower: any) {
    if (follower.candidate_profile_photo) {
      return this.helperService.getImageUrl(follower.candidate_profile_photo, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
