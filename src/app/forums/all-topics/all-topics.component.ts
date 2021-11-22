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
  selector: 'app-all-topics',
  templateUrl: './all-topics.component.html',
  styleUrls: ['./all-topics.component.scss'],
})
export class AllTopicsComponent implements OnInit {
  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    public listingService: ListingService,
    public forumService: ForumService,
    public spinnerService: SpinnerService,
    public helperService: HelperService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snackbarService: SnackBarService
  ) {}

  queryParams = {
    keyword: '',
    limit: 12,
    page: 1,
    status: 'open',
    slug: 'open',
  };

  forumSlug: any;
  forum: any;
  topics: any;
  totalTopics: any;

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;
    this.queryParams.slug = this.route.snapshot.paramMap.get('forum_slug');

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
        this.forum = res.data.data.forum;
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

  addNewTopic(){
    if (!this.helperService.currentUserInfo) {
      this.showLoginModal();

      return;
    }

    const role = this.helperService.currentUserInfo.role;
    const forum_role = this.helperService.currentUserInfo.forum_role;

    if(role == 'admin' || forum_role == 'keymaster' || forum_role == 'moderator' || forum_role == 'participant'){
      this.router.navigate(['/dashboard/topics/new'], { queryParams: {forum_id: this.forum.id}});
    }
    else{
      this.snackbarService.openSnackBar('You are not allowed to add topic.', 'Close', 'warn');
    }
  }

  showLoginModal() {
    this.userService.onLoginLinkModal.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
