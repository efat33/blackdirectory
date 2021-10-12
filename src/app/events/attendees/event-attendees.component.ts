import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { EventService } from '../event.service';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import * as lodash from 'lodash';

declare const google: any;

@Component({
  selector: 'app-event-attendees',
  templateUrl: './event-attendees.component.html',
  styleUrls: ['./event-attendees.component.scss'],
})
export class EventAttendeesComponent implements OnInit, OnDestroy {

  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  eventID: string;
  
  queryParams = {
    keyword: '',
    limit: 20,
    offset: 0,
    page: 1,
    event_id: '',
    attendee_type: '',
  };

  attendees: any;
  totalAttendees: any = 0;

  overview: any = {
    isFetched: false,
    tickets: [],
    checked_in: 0,
    total_rsvp: 0,
    total_ticket: 0
  }


  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    this.queryParams.attendee_type = this.route.snapshot.paramMap.get('type');
    this.eventID = this.queryParams.event_id = this.route.snapshot.paramMap.get('id');
    
    this.spinnerService.show();
    
    const subsGetEvent = this.eventService.getEventByID(this.eventID).subscribe(
      (res:any) => {
        this.spinnerService.hide();
        
        if(!this.helperService.isUserLoggedIn){
          this.router.navigate(['home']);
          return;
        }
        else if(!this.helperService.isAdmin() && this.helperService.currentUserInfo.id != res.data.user_id){
          this.router.navigate(['home']);
          return;
        }

        this.getAttendees();
        this.getAttendeeOverview();
      },
      (res:any) => {
        this.spinnerService.hide();
      }
    );
    
    this.subscriptions.add(subsGetEvent);
  }

  getAttendeeOverview() {
    const rsvpParams = {
      event_id: this.eventID,
      attendee_type: 'rsvp'
    };
    const ticketParams = {
      event_id: this.eventID,
      attendee_type: 'ticket'
    };
    const subsRT = this.eventService.getRsvpTickets(this.eventID);
    const subsRsvp = this.eventService.getAttendees(rsvpParams)
    const subsTicket = this.eventService.getAttendees(ticketParams)

    forkJoin([subsRT, subsRsvp, subsTicket]).subscribe(
      (res: any) => {
        this.overview.isFetched = true;
        this.overview.tickets = res[0].data;
        const rsvp = res[1].data.attendees;
        const tickets = res[2].data.attendees;

        this.overview.total_rsvp = res[1].data.total_attendees;
        this.overview.total_ticket = res[2].data.total_attendees;

        let total_checked_in = 0;
        total_checked_in = res[1].data.attendees.reduce((previousValue, ticket) => {
          if(ticket.checked_in != null){
            return  previousValue + 1;
          }
          return  previousValue;
        }, 0);
        
        total_checked_in = res[2].data.attendees.reduce((previousValue, ticket) => {
          if(ticket.checked_in != null){
            return  previousValue + 1;
          }
          return  previousValue;
        }, total_checked_in);

        this.overview.checked_in = total_checked_in;
        
      },
      (error) => {}
    );
  }

  getAttendees(page: number = 1){
    this.queryParams.page = page;

    this.spinnerService.show();
    
    const subsGetAttendees = this.eventService.getAttendees(this.queryParams).subscribe(
      (res:any) => {
        this.spinnerService.hide();
        this.attendees = res.data.attendees;
        this.totalAttendees = res.data.total_attendees;
      },
      (res:any) => {
        this.spinnerService.hide();
      }
    );
    
    this.subscriptions.add(subsGetAttendees);
  }

  onPageChange(newPage: number) {
    this.getAttendees(newPage);
  }

  onClickCheckin(code, index) {
    const data = {
      code: code,
      attendee_type: this.queryParams.attendee_type
    }

    this.spinnerService.show();
    
    const subsCheckIn = this.eventService.attendeeCheckin(data).subscribe(
      (res:any) => {
        this.spinnerService.hide();

        // update checked in value for the attendee
        this.attendees[index].checked_in = res.data.checked_in;
        
        this.snackbar.openSnackBar(res.message);
      },
      (res:any) => {
        this.spinnerService.hide();
      }
    );
    
    this.subscriptions.add(subsCheckIn);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
