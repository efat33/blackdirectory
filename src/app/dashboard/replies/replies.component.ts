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

@Component({
  selector: 'app-all-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss'],
})
export class AllRepliesComponent implements OnInit {
  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    public listingService: ListingService,
    public forumService: ForumService,
    public spinnerService: SpinnerService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snackbarService: SnackBarService
  ) {}

  queryParams = {
    keyword: '',
    limit: 12,
    page: 1,
  };

  replies: any;
  totalReplies: any;

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;
    const current_user = this.helperService.currentUserInfo;
    if (!this.helperService.isAdmin() && current_user.forum_role != 'keymaster' && current_user.forum_role != 'moderator') {
      this.queryParams['user_id'] = this.helperService.currentUserInfo.id;
    }

    this.getReplies();
  }

  getReplies(page: number = 1) {
    this.queryParams.page = page;
    
    this.spinnerService.show();

    const subsReplies = this.forumService.getReplies(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();
        
        this.replies = res.data.data.replies;
        this.totalReplies = res.data.data.total_replies;
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsReplies);
  }

  onPageChange(newPage: number) {
    this.getReplies(newPage);
  }

  onDeleteReply(reply, index: number) {

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the reply?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
    
        const subsDeleteReply = this.forumService.deleteReply(reply.id).subscribe(
          (res:any) => {
            this.spinnerService.hide();
            this.snackbarService.openSnackBar(res.message);
            this.replies.splice(index, 1);
          },
          (res:any) => {
            this.spinnerService.hide();
          }
        );
        
        this.subscriptions.add(subsDeleteReply);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
