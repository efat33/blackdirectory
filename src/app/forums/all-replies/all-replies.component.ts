import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForumService } from 'src/app/forums/forum.service';
import { ListingService } from 'src/app/listing/listing.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-all-replies',
  templateUrl: './all-replies.component.html',
  styleUrls: ['./all-replies.component.scss'],
})
export class AllRepliesComponent implements OnInit {
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
    slug: '',
  };

  topicSlug: any;
  topic: any;
  replies: any;
  totalReplies: any;
  postId: any;

  replyForm: FormGroup;
  showError = false;
  errorMessage = '';

  isLoggedIn:boolean = false;
  canModifyReply:boolean = false;
  loggedUserId:number = null;

  ckConfig = {
    placeholder: '',
  };

  ckEditor = DocumentEditor;

  ngOnInit() {
    this.initialiseReplyForm();

    this.siteUrl = this.helperService.siteUrl;
    this.queryParams.slug = this.route.snapshot.paramMap.get('topic_slug');
    this.postId = this.route.snapshot.queryParamMap.get('post_id');

    if(this.helperService.currentUserInfo){
      this.isLoggedIn = true;
      this.loggedUserId = this.helperService.currentUserInfo.id;
    }
    if(this.helperService.currentUserInfo?.role == 'admin' || this.helperService.currentUserInfo?.forum_role == 'keymaster'
    || this.helperService.currentUserInfo?.forum_role == 'moderator'){
      this.canModifyReply = true;
    }
    

    this.getReplies();
    
  }

  ngAfterViewInit() {
    
  }

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());

  }

  initialiseReplyForm() {
    this.replyForm = new FormGroup({
      content: new FormControl('', Validators.required),
      forum_id: new FormControl(''),
      topic_id: new FormControl(''),
      reply_to: new FormControl(null),
      notify_by_email: new FormControl(0)
    });
  }

  getReplies(page: number = 1) {
    this.queryParams.page = page;
    
    this.spinnerService.show();

    const subsTopics = this.forumService.getReplies(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.replies = res.data.data.replies;
        this.totalReplies = res.data.data.total_replies;
        this.topic = res.data.data.topic;

        // set topic id to reply form
        this.replyForm.get('topic_id').patchValue(this.topic.id);
        this.replyForm.get('forum_id').patchValue(this.topic.forum_id);
        
        setTimeout(() => {
          if(this.postId) {
            let el = document.getElementById('single_reply_'+this.postId);
            el.scrollIntoView({behavior: 'smooth'});
          }
        }, 0);
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsTopics);
  }

  onPageChange(newPage: number) {
    this.getReplies(newPage);
  }

  addNewTopic(){
    if (!this.helperService.currentUserInfo) {
      this.showLoginModal();

      return;
    }

    const role = this.helperService.currentUserInfo.role;
    const forum_role = this.helperService.currentUserInfo.forum_role;

    if(role == 'admin' || forum_role == 'keymaster' || forum_role == 'moderator' || forum_role == 'participant'){
      this.router.navigate(['/dashboard/topics/new'], { queryParams: {forum_id: this.topic.forum_id}});
    }
    else{
      this.snackbarService.openSnackBar('You are not allowed to add topic.', 'Close', 'warn');
    }
  }

  getCommentAvatar(image: string) {
    if (image) {
      return this.helperService.getImageUrl(image, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  onSubmitReply() {
    const formValues = this.replyForm.value;

    this.spinnerService.show();
    const newReplySubscription = this.forumService.addReply(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        const reply_id = result.data.reply_id;

        // this.router.navigate([`/forums/topic/${this.topic.slug}`], { queryParams: {post_id: reply_id }});
        window.location.replace(`${this.siteUrl}/forums/topic/${this.topic.slug}/?post_id=${reply_id}`);
        this.snackbarService.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbarService.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newReplySubscription);
  }

  showLoginModal() {
    this.userService.onLoginLinkModal.emit();
  }

  onClickReplyTo(reply) {
    this.replyForm.get('reply_to').patchValue(reply.id);

    const el = document.getElementById('replyFormWrapper');
    el.scrollIntoView({behavior: 'smooth'});
  }

  onClickAddReply() {
    if (this.helperService.currentUserInfo && this.helperService.currentUserInfo.forum_role != 'spectator') {
      // set reply_to to null in case reply button was previously clicked
      this.replyForm.get('reply_to').patchValue(null);

      const el = document.getElementById('replyFormWrapper');
      el.scrollIntoView({behavior: 'smooth'});
    } else {
      this.showLoginModal();
    }
  }

  onDeleteReply(reply) {

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
            window.location.replace(`${this.siteUrl}/forums/topic/${this.topic.slug}`);
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

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
