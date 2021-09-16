import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/events/event.service';
import { ListingService } from 'src/app/listing/listing.service';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    public eventService: EventService,
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
    offset: 0,
    page: 1,
    past_event: 0,
  };

  events: any;
  totalEvetns: any;

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    if (!this.helperService.isAdmin()) {
      this.queryParams['user_id'] = this.helperService.currentUserInfo.id;
    }

    this.getEvents();
  }

  getEventImageSrc(src, size: 'thumb' | 'medium' | 'full' = 'full') {
    return this.helperService.getImageUrl(src, 'event', size);
  }

  getEvents(page: number = 1) {
    this.queryParams.page = page;

    this.spinnerService.show();

    const subsEvents = this.eventService.searchEvent(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.events = res.data.events;
        this.totalEvetns = res.data.total_events;
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsEvents);
  }

  onPageChange(newPage: number) {
    this.getEvents(newPage);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
