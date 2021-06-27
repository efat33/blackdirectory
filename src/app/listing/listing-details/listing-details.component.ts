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

  listing:any;

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
    this.listing_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (this.listing_slug != null) {
      this.spinnerService.show();
      
      const subscriptionGetlisting = this.listingService.getListing(this.listing_slug).subscribe(
        (res:any) => {
          
          this.listing = res.data;

          // display edit or submit button
          if(this.helperservice.isUserLoggedIn() && this.helperservice.currentUserInfo.id == res.data.listing.user_id){
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


  onSubmitListing() {
    const listing_id = this.listing.listing.id;
    this.spinnerService.show();
    const subscriptionPublishListing = this.listingService.publishListing({id: listing_id}).subscribe(
      (res:any) => {
        console.log(res);
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message);
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




