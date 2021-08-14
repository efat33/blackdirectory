import { Component, OnInit } from '@angular/core';
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
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})

export class EventDetailsComponent implements OnInit {

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
        if(index == 0){
          let rem = parseInt(element) - 1;
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number">${rem}</div>
                            <div class="epta-countdown-under">days</div>
                        </div>`);
        }
        else if(index == 1){
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number">${element}</div>
                            <div class="epta-countdown-under">hours</div>
                        </div>`);
        }
        else if(index == 2){
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number">${element}</div>
                            <div class="epta-countdown-under">min</div>
                        </div>`);
        }
        else if(index == 3){
          preText.push(`<div class="epta-countdown-cell">
                            <div class="epta-countdown-number tecset-countdown-last">${element}</div>
                            <div class="epta-countdown-under">sec</div>
                        </div>`);
        }
      }

      return `<div class="epta-countdown-timer">${preText.join('')}</div>`;
    },
  };
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    private eventService: EventService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService,
    public sanitizer:DomSanitizer,
  ) {}


  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    this.eventSlug = this.route.snapshot.paramMap.get('slug');

    this.getEventDetails();
    

  }

  getEventDetails() {
    this.spinnerService.show();
    
    const subsEventDetails = this.eventService.getEvent(this.eventSlug).subscribe(
      (res:any) => {

        this.event = res.data;
    
        this.getUserTicketsRsvp();
        this.setCoundownTime();

        if(this.event.is_virtual == 1){
          const url_arr = this.event.youtube_url.split('?v=');

          let video_id = '';
          if(url_arr.length == 2){
            video_id = url_arr[1].replace('/', '');
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/'+video_id+'?feature=oembed'); 
          }
        }
      },
      (res:any) => {
        this.spinnerService.hide();

      }
    );
    
    this.subscriptions.add(subsEventDetails);
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

  calculateRsvpTicket(rsvp, tickets){
    // rsvp calculation
    const rsvpObj = {total: 0, rsvp: {}};
    for (const item of rsvp) {
      // increase the total number
      rsvpObj.total = rsvpObj.total + 1;

      rsvpObj.rsvp[item.event_ticket_id] = rsvpObj.rsvp[item.event_ticket_id] ? rsvpObj.rsvp[item.event_ticket_id] + 1 : 1;

    }

    this.userRsvp = rsvpObj;

  }

  getRelatedEvents() {
    
    const subsRelatedE = this.eventService.getRelatedEvents(this.event.id).subscribe(
      (res:any) => {
    
        this.relatedEvents = res.data;
      },
      (res:any) => {

      }
    );
    
    this.subscriptions.add(subsRelatedE);
  }

  showRsvpApplyModal(rsvp_id, index) {
    
    if(this.helperService.currentUserInfo?.id){
      this.dialogRsvpApply = this.dialog.open(RsvpApplyModal, {
        width: '400px',
        data: { rsvp_id }
      });

      this.dialogRsvpApply.afterClosed().subscribe((result) => {
        const guest_no = result.guest_no;

        // update data
        this.userRsvp.total = parseInt(this.userRsvp.total) + parseInt(guest_no);
        this.userRsvp.rsvp[rsvp_id] = this.userRsvp.rsvp[rsvp_id] ? parseInt(this.userRsvp.rsvp[rsvp_id]) + parseInt(guest_no) : parseInt(guest_no);

        this.event.rsvp[index].going = true;
        this.event.rsvp[index].available = this.event.rsvp[index].available - parseInt(guest_no);
      });

      this.subscriptions.add(this.dialogRsvpApply);

    }
    else{
      this.dialog.open(LoginModal, {
        width: '400px'
      });
    }

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}

