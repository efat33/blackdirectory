import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListingService } from 'src/app/listing/listing.service';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
})
export class ListingsComponent implements OnInit {
  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    public listingService: ListingService,
    public spinnerService: SpinnerService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snackbarService: SnackBarService
  ) {}

  queryParams = {
    keyword: '',
    order: 'desc',
    orderby: 'created_at',
    limit: 12,
    offset: 0,
    page: 1,
    user_id: this.helperService.currentUserInfo.id,
  };

  listings: any;
  totalListings: any;

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    this.getListings();
  }

  getListingImageSrc(src, size: 'thumb' | 'medium' | 'full' = 'full') {
    return this.helperService.getImageUrl(src, 'listing', size);
  }

  getListings(page: number = 1) {
    this.queryParams.page = page;

    this.spinnerService.show();

    const subsListings = this.listingService.searchListing(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.listings = res.data.listings;
        this.totalListings = res.data.total_listings;
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsListings);
  }

  onPageChange(newPage: number) {
    this.getListings(newPage);
  }

  onRemoveListing(listing_id: number, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure you want to delete this listing"?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscriptionDeleteLlisting = this.listingService.deleteListing(listing_id).subscribe(
          (res: any) => {
            this.spinnerService.hide();
            this.listings.splice(index, 1);

            this.snackbarService.openSnackBar(res.message);
          },
          (res: any) => {
            this.spinnerService.hide();
            this.snackbarService.openSnackBar(res.error.message, '', 'warn');
          }
        );

        this.subscriptions.add(subscriptionDeleteLlisting);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
