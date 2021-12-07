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
  selector: 'app-all-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class AllTopicsComponent implements OnInit {
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

  topics: any;
  totalTopics: any;

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    if (!this.helperService.isAdmin()) {
      this.queryParams['user_id'] = this.helperService.currentUserInfo.id;
    }

    this.getTopics();
  }

  getTopics(page: number = 1) {
    this.queryParams.page = page;
    
    this.spinnerService.show();

    const subsTopics = this.forumService.getTopics(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.topics = res.data.data.topics;
        this.totalTopics = res.data.data.total_topics;
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsTopics);
  }

  onPageChange(newPage: number) {
    this.getTopics(newPage);
  }

  onDeleteTopic(topic_id: number, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Deleting the topic would also delete all its replies. Are you sure you want to delete the Topic?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscriptionDeleteLlisting = this.forumService.deleteTopic(topic_id).subscribe(
          (res: any) => {
            this.spinnerService.hide();
            this.topics.splice(index, 1);

            this.snackbarService.openSnackBar(res.message);
          },
          (res: any) => {
            this.spinnerService.hide();
            this.snackbarService.openSnackBar(res.error.message, '', 'warn');
          }
        );

        this.subscriptions.add(subscriptionDeleteLlisting);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
