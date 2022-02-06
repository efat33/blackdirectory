import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CountdownConfig } from 'ngx-countdown';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { RsvpApplyModal } from 'src/app/modals/events/details/rsvp-apply/rsvp-apply-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { EventService } from '../../events/event.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import * as lodash from 'lodash';
import { TravelService } from '../travels.service';

declare const google: any;

@Component({
  selector: 'app-travel-details',
  templateUrl: './travel-details.component.html',
  styleUrls: ['./travel-details.component.scss'],
})
export class TravelDetailsComponent implements OnInit, OnDestroy {

  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  travelSlug: string;
  event: any = {};

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    private eventService: EventService,
    private travelService: TravelService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    this.travelSlug = this.route.snapshot.paramMap.get('travel_slug');

    this.getTravelDetails();
  }

  getTravelDetails() {
    this.spinnerService.show();

    const subsTravelDetails = this.travelService.getSingleTravel(this.travelSlug).subscribe(
      (res: any) => {
        this.spinnerService.hide();
        this.event = res.data[0];
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsTravelDetails);
  }

  showLoginModal() {
    this.userService.onLoginLinkModal.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
