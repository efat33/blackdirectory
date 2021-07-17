import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { ListingService } from '../listing.service';



@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss']
})

export class ListingDetailsComponent implements OnInit {

  subscriptions: Subscription = new Subscription();
  
  listing_slug:string;
  showEditButton:boolean = false;
  showSubmitButton:boolean = false;

  listing:any = {};
  listing_categories:any = [];
  listing_contact:any = {};
  listing_hours:any = [];
  listing_menus:any = [];

  current_weekday:any;
  isTodayOpen:boolean;
  cover_img = '';
  logo = '';
  featured_img = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private listingService: ListingService,
    private helperservice: HelperService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
  ) { }


  ngOnInit() {

    const today = new Date();
    this.current_weekday = today.getUTCDay() == 0 ? 6 : today.getUTCDay() - 1;

    this.listing_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (this.listing_slug != null) {
      this.spinnerService.show();
      
      const subscriptionGetlisting = this.listingService.getListing(this.listing_slug).subscribe(
        (res:any) => {
          
          this.listing = res.data.listing;
          this.listing_categories = res.data.categories;
          this.listing_contact = res.data.contacts;
          this.listing_hours = res.data.hours;
          this.listing_menus = res.data.menus;
          
          // set images path
          this.setImagesPath();
          this.isTodayOpen = this.calTodayOpen();

          // display edit or submit button
          if(this.helperservice.isUserLoggedIn() && (this.helperservice.currentUserInfo.id == res.data.listing.user_id || this.helperservice.currentUserInfo.id == res.data.listing.claimer_id) ){
            this.showEditButton = true;
            if(res.data.listing.status == 'draft') this.showSubmitButton = true;
          }

          this.spinnerService.hide();
  
        },
        (res:any) => {
          this.spinnerService.hide();
          // TODO: redirect to 404 page
        }
      );
  
      this.subscriptions.add(subscriptionGetlisting);

    }

  }

  calTodayOpen() {
    const d = new Date(); // current time
    const hours = d.getUTCHours();
    const mins = d.getUTCMinutes();
    const listing_time = this.listing_hours[this.current_weekday];
    
    if (listing_time.is_open != 1) return false;

    const first_start_hour = listing_time.first_hour_start.split(':')[0];
    const first_start_minute = listing_time.first_hour_start.split(':')[1];
    const first_end_hour = listing_time.first_hour_end.split(':')[0];
    const first_end_minute = listing_time.first_hour_end.split(':')[1];

    if( hours >= first_start_hour && mins >= first_start_minute && 
      (hours < first_end_hour || hours == first_end_hour && mins <= first_end_minute) ){
        return true;
    }

    if(listing_time.second_hour_start && listing_time.second_hour_end){
      const start_hour = listing_time.second_hour_start.split(':')[0];
      const start_minute = listing_time.second_hour_start.split(':')[1];
      const end_hour = listing_time.second_hour_end.split(':')[0];
      const end_minute = listing_time.second_hour_end.split(':')[1];
      
      if( hours >= start_hour && mins >= start_minute && 
        (hours < end_hour || hours == end_hour && mins <= end_minute) ){
          return true;
      }

    }

    return false;

  }

  setImagesPath() {
    this.cover_img = this.helperservice.getImageUrl(this.listing.cover_img, 'listing', 'large');
    this.logo = this.helperservice.getImageUrl(this.listing.logo, 'listing', 'thumb');
  }


  onSubmitListing() {
    const listing_id = this.listing.listing.id;
    this.spinnerService.show();
    const subscriptionPublishListing = this.listingService.publishListing({id: listing_id}).subscribe(
      (res:any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message);

        // hide sumit button
        this.showSubmitButton = false;
      },
      (res:any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
      }
    );
  
    this.subscriptions.add(subscriptionPublishListing);

  }

  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}




