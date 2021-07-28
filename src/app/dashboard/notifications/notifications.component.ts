import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  notifications: any = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.spinnerService.show();
    const subscription = this.userService.getNotifications().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.notifications = result.data;

        this.processNotifications();
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  processNotifications() {
    for (const notification of this.notifications) {
      notification.fullText = this.getNotificationText(notification);
      notification.shortText = this.getUnreadNotificationText(notification);
      notification.icon = this.getNotificationIconName(notification);
      notification.class = this.getNotificationClassName(notification);
    }
  }

  getNotificationText(notification: any) {
    if (notification.notification_type === 'job') {
      return this.getJobNotificationText(notification);
    }
  }

  getJobNotificationText(notification: any) {
    const job = notification.job;

    if (notification.notification_trigger === 'shortlisted') {
      return `You are shortlisted for interview the job '<a href="/jobs/details/${job.slug}">${job.title}</a>' by '<a href="/user-details/${notification.user_username}">${notification.user_display_name}</a>' you applied.`;
    }

    if (notification.notification_trigger === 'rejected') {
      return `You are rejected for interview the job '<a href="/jobs/details/${job.slug}">${job.title}</a>' by '<a href="/user-details/${notification.user_username}">${notification.user_display_name}</a>' you applied.`;
    }

    if (notification.notification_trigger === 'new job application') {
      return `A new application is submitted on your job '<a href="/jobs/details/${job.slug}">${job.title}</a>' by '<a href="/user-details/${notification.user_username}">${notification.user_display_name}</a>' you applied.`;
    }

    if (notification.notification_trigger === 'new job') {
      return `A new job '<a href="/jobs/details/${job.slug}">${job.title}</a>' is posted by '<a href="/user-details/${notification.user_username}">${notification.user_display_name}</a>' you are following.`;
    }
  }

  getUnreadNotificationText(notification: any) {
    if (notification.notification_type === 'job') {
      return this.getUnreadJobNotificationText(notification);
    }
  }

  getUnreadJobNotificationText(notification: any) {
    if (notification.notification_trigger === 'shortlisted') {
      return `You are shortlisted for interview...`;
    }

    if (notification.notification_trigger === 'rejected') {
      return `You are rejected for interview...`;
    }

    if (notification.notification_trigger === 'new job application') {
      return `A new application is submitted on...`;
    }

    if (notification.notification_trigger === 'new job') {
      return `A new job is posted...`;
    }
  }

  getNotificationIconName(notification: any) {
    if (notification.notification_type === 'job') {
      return this.getJobNotificationIconName(notification);
    }
  }

  getJobNotificationIconName(notification: any) {
    if (notification.notification_trigger === 'shortlisted') {
      return 'fa fa-info';
    }

    if (notification.notification_trigger === 'rejected') {
      return 'fa fa-times';
    }

    if (
      notification.notification_trigger === 'new job application' ||
      notification.notification_trigger === 'new job'
    ) {
      return 'fa fa-check';
    }
  }

  getNotificationClassName(notification: any) {
    if (notification.notification_type === 'job') {
      return this.getJobNotificationClassName(notification);
    }
  }

  getJobNotificationClassName(notification: any) {
    if (notification.notification_trigger === 'shortlisted') {
      return 'shrtlist-for-jobnoti';
    }

    if (notification.notification_trigger === 'rejected') {
      return 'reject-for-jobnoti';
    }

    if (
      notification.notification_trigger === 'new job application' ||
      notification.notification_trigger === 'new job'
    ) {
      return 'candapply-for-jobnoti';
    }
  }

  readNotification(notification: any) {
    this.spinnerService.show();
    const subscription = this.userService.updateNotification(notification.id, { is_read: true }).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        notification.is_read = true;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  removeNotification(notification: any, index: number) {
    this.spinnerService.show();
    const subscription = this.userService.removeNotification(notification.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.notifications.splice(index, 1);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  processLink(event: any) {
    event.preventDefault();

    this.router.navigate([event.target.getAttribute('href')]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
