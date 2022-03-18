import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { HelperService } from 'src/app/shared/helper.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['../news-lists/news-lists.component.scss', './news-details.component.scss'],
})
export class NewsDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('newCommentInput') newCommentInput: ElementRef;

  subscriptions: Subscription = new Subscription();

  featuredNews: any;
  siteUrl: any;
  news: any;
  newsSlug: string;

  editCommentClickId: number;
  clientIp: string;

  newComment: string = '';

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private newsService: NewsService,
    private userService: UserService,
    private helperService: HelperService,
    private snackbar: SnackBarService,
    private spinnerService: SpinnerService,
    private seo: SeoService,
  ) {}

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;
    
    this.route.params.subscribe((params) => {
      this.newsSlug = this.route.snapshot.paramMap.get('news-slug');

      this.getNews();
      this.getFeaturedNews();
    });
  }

  ngAfterViewInit() {
    
  }

  setSeoData(sData) {
    this.seo.generateTags({
      title: sData.meta_title || this.news.title, 
      description: sData.meta_desc || '', 
      image: this.helperService.getImageUrl(sData.featured_image, 'news', 'medium') || this.helperService.defaultSeoImage,
      slug: `news/details/${this.newsSlug}`,
      keywords: sData.meta_keywords || '',
    });
  }

  getNews() {
    this.spinnerService.show();
    const subscription = this.newsService.getSingleNews(this.newsSlug).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.news = result.data[0];

        this.setSeoData(this.news);

        this.getUserLikes();

        setTimeout(() => {
          this.route.fragment.subscribe(f => {
            const element = document.getElementById(f);
            if (element) element.scrollIntoView({behavior: 'smooth'});
          });
        }, 500);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getFeaturedNews() {
    const body: any = { featured: true };

    const subscription = this.newsService.getNewsByQuery(body, 20).subscribe(
      (result: any) => {
        this.featuredNews = result.data;
      },
      (error) => {
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getUserLikes() {
    const ipSub = this.userService.clientIp.subscribe((ip: string) => {
      this.clientIp = ip;

      const userId = this.helperService.currentUserInfo?.id ? this.helperService.currentUserInfo.id : this.clientIp;

      const subscription = this.newsService.getUserCommentLikes(userId).subscribe(
        (result: any) => {
          for (const like of result.data) {
            const comment = this.news.comments.find((com: any) => com.id === like.news_comment_id);

            if (comment) {
              comment.liked = true;
            }
          }
        },
        (error) => {
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

      this.subscriptions.add(subscription);
    });

    this.subscriptions.add(ipSub);
  }

  getTotalComments() {
    if (!this.news) {
      return null;
    }

    let total = this.news.comments?.length || 0;

    for (const comment of this.news.comments) {
      total += comment.replies?.length || 0;
    }

    return total;
  }

  getCommentAvatar(image: string) {
    if (image) {
      return this.helperService.getImageUrl(image, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  userCanEditComment(comment: any): boolean {
    return comment.user_id === this.helperService.currentUserInfo?.id;
  }

  userCanEditReply(reply: any): boolean {
    return reply.user_id === this.helperService.currentUserInfo?.id;
  }

  onDeleteComment(comment: any, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the comment"?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscriptionDeleteReview = this.newsService.deleteNewsComment(comment.id).subscribe(
          (res: any) => {
            this.news.comments.splice(index, 1);
          },
          (error: any) => {
            this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
          }
        );
        this.subscriptions.add(subscriptionDeleteReview);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);
  }

  onDeleteReply(comment: any, commentIndex: number, replyIndex: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the comment"?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscriptionDeleteReview = this.newsService.deleteNewsComment(comment.id).subscribe(
          (res: any) => {
            this.news.comments[commentIndex].replies.splice(replyIndex, 1);
          },
          (error: any) => {
            this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
          }
        );
        this.subscriptions.add(subscriptionDeleteReview);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);
  }

  onClickLikeComment(comment: any, index: number) {
    const userId = this.helperService.currentUserInfo?.id
      ? this.helperService.currentUserInfo.id
      : this.clientIp;

    const body = {
      news_comment_id: comment.id,
      news_id: this.news.id,
      user_id: userId,
    };

    const subscriptionLikeReview = this.newsService.updateCommentLike(body).subscribe(
      (res: any) => {
        comment.liked = !comment.liked;

        if (comment.liked) {
          comment.likes++;
        } else {
          comment.likes--;
        }
      },
      (error: any) => {
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscriptionLikeReview);
  }

  onSubmitReply(event: any, commentElement: any, comment: any, reply: any = null) {
    event.preventDefault();

    if (!this.helperService.currentUserInfo) {
      this.showLoginModal();
      return;
    }

    if (!commentElement.value?.trim()) {
      return;
    }

    if (reply) {
      this.editReply(commentElement, comment, reply);
    } else {
      this.addReply(commentElement, comment);
    }
  }

  addReply(commentElement: any, comment: any) {
    const body = {
      news_id: this.news.id,
      comment: commentElement.value.trim(),
      parent_id: comment.id,
    };

    this.spinnerService.show();
    const subscription = this.newsService.addNewComment(body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (!comment.replies) {
          comment.replies = [];
        }

        comment.replies.push(result.data);
        commentElement.value = '';
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editReply(commentElement: any, comment: any, reply: any = null) {
    const body = {
      comment: commentElement.value.trim(),
    };

    this.spinnerService.show();
    const subscription = this.newsService.updateNewsComment(reply.id, body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        reply.comment = commentElement.value.trim();
        reply.editing = false;

        commentElement.value = '';
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  onClickReplyEdit(reply: any) {
    reply.editing = true;
  }

  onCloseReplyEdit(reply: any) {
    reply.editing = false;
  }

  userCanComment() {
    return this.helperService.currentUserInfo != null;
  }

  addNewComment() {
    if (!this.newComment.trim()) {
      return;
    }

    const body = {
      news_id: this.news.id,
      comment: this.newComment.trim(),
    };

    this.spinnerService.show();
    const subscription = this.newsService.addNewComment(body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (!this.news.comments) {
          this.news.comments = [];
        }

        this.news.comments.push(result.data);
        this.newComment = '';
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  updateComment(commentElement: any, comment: any) {
    const body = {
      comment: commentElement.value.trim(),
    };

    this.spinnerService.show();
    const subscription = this.newsService.updateNewsComment(comment.id, body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        comment.comment = commentElement.value.trim();
        comment.editing = false;

        commentElement.value = '';
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  onAddCommentClick() {
    if (this.helperService.currentUserInfo) {
      this.newCommentInput.nativeElement.scrollIntoViewIfNeeded();
      this.newCommentInput.nativeElement.focus();
    } else {
      this.showLoginModal();
    }
  }

  hambergureClick(comment: any, event: MouseEvent) {
    event.stopPropagation();

    this.editCommentClickId = comment.id;
  }

  showLoginModal() {
    this.userService.onLoginLinkModal.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
