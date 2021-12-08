import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForumService } from 'src/app/forums/forum.service';
import { ListingService } from 'src/app/listing/listing.service';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-forum-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class ForumUserProfileComponent implements OnInit {
  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    public forumService: ForumService,
    public spinnerService: SpinnerService,
    public helperService: HelperService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snackbarService: SnackBarService
  ) {}


  usernameSlug: any;
  userDetails: any;
  profileImage: string = `${this.helperService.siteUrl}/assets/img/avatar-default.png`;
  userMeta = {
    'last_activity': '',
    'topics_no': '',
    'reply_no': ''
  }

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;
    this.usernameSlug = this.route.snapshot.paramMap.get('username');

    if(this.usernameSlug) this.getUserDetails();
  }

  getUserDetails() {
    this.spinnerService.show();
    
    const subsUserDetails = this.userService.getDetails(this.usernameSlug).subscribe(
      (res:any) => {
        this.spinnerService.hide();
        this.userDetails = res.data.data;
        const meta_data = res.data.meta_data;
        this.userMeta.last_activity = this.helperService.getMetaData(meta_data, 'forum_last_activity');
        this.userMeta.topics_no = this.helperService.getMetaData(meta_data, 'topics_no');
        this.userMeta.reply_no = this.helperService.getMetaData(meta_data, 'replies_no');

        if (this.userDetails.profile_photo) {
          this.profileImage = this.helperService.getImageUrl(this.userDetails.profile_photo, 'users', 'medium');
        }
      },
      (res:any) => {
        this.spinnerService.hide();
      }
    );
    
    this.subscriptions.add(subsUserDetails);
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
