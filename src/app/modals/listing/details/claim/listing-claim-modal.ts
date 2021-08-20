import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { ListingService } from 'src/app/listing/listing.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

export interface DialogData {
    listing_id: number
}

@Component({
    selector: 'listing-claim-modal',
    templateUrl: 'listing-claim-modal.html',
    styleUrls: ['listing-claim-modal.scss']
})

export class ListingClaimModal implements OnInit {

    subscriptions = new Subscription();

    listingClaimForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<ListingClaimModal>,
        private spinnerService: SpinnerService,
        private listingService: ListingService,
        private snackbarService: SnackBarService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.listingClaimForm = new FormGroup({
            listing_id: new FormControl(this.data.listing_id ? this.data.listing_id : '', Validators.required),
            firstname: new FormControl('', Validators.required),
            lastname: new FormControl('', Validators.required),
            phone: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
          });
    }

    onSubmit() {
        this.showError = false;
        this.errorMessage = '';

        this.spinnerService.show();
        
        const subsListingClaimModal = this.listingService.newClaim(this.listingClaimForm.value).subscribe(
          (res:any) => {
        
            this.spinnerService.hide();

            this.snackbarService.openSnackBar(res.message);

            this.dialogRef.close();
          },
          (res:any) => {
            this.spinnerService.hide();
            this.showError = true;
            this.errorMessage = res.error.message;
          }
        );
        
        this.subscriptions.add(subsListingClaimModal);
    }

    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }
    
}