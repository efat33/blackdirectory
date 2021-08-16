import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CountdownConfig } from 'ngx-countdown';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { RsvpApplyModal } from 'src/app/modals/events/details/rsvp-apply/rsvp-apply-modal';
import { LoginModal } from 'src/app/modals/user/login/login-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { EventService } from '../event.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import * as lodash from 'lodash';

declare const google: any;

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('newCommentInput') newCommentInput: ElementRef;

  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  eventSlug: string;
  event: any = {};
  relatedEvents: any = null;
  userTickets: any = [];
  userRsvp: any = null;
  videoUrl: SafeResourceUrl;

  dialogRsvpApply: any;

  config: CountdownConfig = {
    leftTime: null,
    format: 'd:HH:mm:ss',
    prettyText: (text) => {
      const textArr = text.split(':');

      const preText = [];
      for (let index = 0; index < textArr.length; index++) {
        const element = textArr[index];
        if (index == 0) {
          const rem = parseInt(element) - 1;
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number">${rem}</div>
                            <div class="epta-countdown-under">days</div>
                        </div>`);
        } else if (index == 1) {
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number">${element}</div>
                            <div class="epta-countdown-under">hours</div>
                        </div>`);
        } else if (index == 2) {
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number">${element}</div>
                            <div class="epta-countdown-under">min</div>
                        </div>`);
        } else if (index == 3) {
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number tecset-countdown-last">${element}</div>
                            <div class="epta-countdown-under">sec</div>
                        </div>`);
        }
      }

      return `<div class="epta-countdown-timer">${preText.join('')}</div>`;
    },
  };

  editCommentClickId: number;
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    private eventService: EventService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    this.eventSlug = this.route.snapshot.paramMap.get('slug');

    this.getEventDetails();
  }

  getEventDetails() {
    this.spinnerService.show();

    const subsEventDetails = this.eventService.getEvent(this.eventSlug).subscribe(
      (res: any) => {
        this.event = res.data;

        this.getUserTicketsRsvp();
        this.setCoundownTime();

        if (this.event.is_virtual == 1) {
          const url_arr = this.event.youtube_url.split('?v=');

          let video_id = '';
          if (url_arr.length == 2) {
            video_id = url_arr[1].replace('/', '');
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              '//www.youtube.com/embed/' + video_id + '?feature=oembed'
            );
          }
        }

        this.initializeGoogleMap();
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsEventDetails);
  }

  initializeGoogleMap() {
    if (!(this.event.latitude && this.event.longitude)) {
      return;
    }

    const mapProp = {
      zoom: 15,
      scrollwheel: true,
      zoomControl: true,
    };

    const lat = parseFloat(this.event.latitude);
    const lng = parseFloat(this.event.longitude);

    const latlng = { lat, lng };

    const map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const mapMarker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    map.setCenter(latlng);
    mapMarker.setPosition(latlng);
  }

  setCoundownTime() {
    const today = this.helperService.dateTimeNow();

    const now = moment(today, 'YYYY-MM-DD HH:mm:ss');
    const end = moment(this.event.start_time, 'YYYY-MM-DD HH:mm:ss');
    const duration = moment.duration(end.diff(now));
    const seconds = duration.asSeconds();

    this.config.leftTime = seconds;
  }

  getUserTicketsRsvp() {
    const subsUserTickets = this.eventService.getUserTickets(this.event.id);
    const subsUserRsvp = this.eventService.getUserRsvp(this.event.id);

    forkJoin([subsUserTickets, subsUserRsvp]).subscribe(
      (res: any) => {
        // hide spinner
        this.spinnerService.hide();

        const tickets = res[0].data;
        const rsvp = res[1].data;

        // TODO:  call functions for related events, comments etc

        this.calculateRsvpTicket(rsvp, tickets);
        this.getRelatedEvents();
      },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  calculateRsvpTicket(rsvp, tickets) {
    // rsvp calculation
    const rsvpObj = { total: 0, rsvp: {} };
    for (const item of rsvp) {
      // increase the total number
      rsvpObj.total = rsvpObj.total + 1;

      rsvpObj.rsvp[item.event_ticket_id] = rsvpObj.rsvp[item.event_ticket_id]
        ? rsvpObj.rsvp[item.event_ticket_id] + 1
        : 1;
    }

    this.userRsvp = rsvpObj;
  }

  getRelatedEvents() {
    const subsRelatedE = this.eventService.getRelatedEvents(this.event.id).subscribe(
      (res: any) => {
        this.relatedEvents = res.data;
      },
      (res: any) => {}
    );

    this.subscriptions.add(subsRelatedE);
  }

  showRsvpApplyModal(rsvp_id, index) {
    if (this.helperService.currentUserInfo?.id) {
      this.dialogRsvpApply = this.dialog.open(RsvpApplyModal, {
        width: '400px',
        data: { rsvp_id },
      });

      this.dialogRsvpApply.afterClosed().subscribe((result) => {
        const guest_no = result.guest_no;

        // update data
        this.userRsvp.total = parseInt(this.userRsvp.total) + parseInt(guest_no);
        this.userRsvp.rsvp[rsvp_id] = this.userRsvp.rsvp[rsvp_id]
          ? parseInt(this.userRsvp.rsvp[rsvp_id]) + parseInt(guest_no)
          : parseInt(guest_no);

        this.event.rsvp[index].going = true;
        this.event.rsvp[index].available = this.event.rsvp[index].available - parseInt(guest_no);
      });

      this.subscriptions.add(this.dialogRsvpApply);
    } else {
      this.dialog.open(LoginModal, {
        width: '400px',
      });
    }
  }


  getTotalComments() {
    if (!this.event || lodash.isEmpty(this.event)) {
      return null;
    }

    let total = this.event.comments?.length || 0;

    for (const comment of this.event.comments) {
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
      data: { message: 'Are you sure to delete the comment"?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscriptionDeleteReview = this.eventService.deleteEventComment(comment.id).subscribe(
          (res: any) => {
            this.event.comments.splice(index, 1);
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
      data: { message: 'Are you sure to delete the comment"?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscriptionDeleteReview = this.eventService.deleteEventComment(comment.id).subscribe(
          (res: any) => {
            this.event.comments[commentIndex].replies.splice(replyIndex, 1);
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
      event_id: this.event.id,
      comment: commentElement.value.trim(),
      parent_id: comment.id,
    };

    this.spinnerService.show();
    const subscription = this.eventService.addNewComment(body).subscribe(
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
    const subscription = this.eventService.updateEventComment(reply.id, body).subscribe(
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
      event_id: this.event.id,
      comment: this.newComment.trim(),
    };

    this.spinnerService.show();
    const subscription = this.eventService.addNewComment(body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (!this.event.comments) {
          this.event.comments = [];
        }

        this.event.comments.push(result.data);
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
    const subscription = this.eventService.updateEventComment(comment.id, body).subscribe(
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
    this.dialog.open(LoginModal, {
      width: '400px',
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
