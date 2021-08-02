import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { ListingService } from 'src/app/listing/listing.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';

export interface DialogData {
    listing_id: number;
    user_id: string;
    review: any;
}

@Component({
    selector: 'listing-review-modal',
    templateUrl: 'listing-review-modal.html',
    styleUrls: ['listing-review-modal.scss']
})

export class ListingReviewModal implements OnInit {

    subscriptions: Subscription = new Subscription();

    ckEditor = DocumentEditor;
    ckConfig = {
        placeholder: 'Content',
        height: 200,
        toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList'],
    };

    listingReviewForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<ListingReviewModal>,
        private spinnerService: SpinnerService,
        private helperService: HelperService,
        private listingService: ListingService,
        private snackbar: SnackBarService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {

    }

    ngOnInit(): void {
        this.listingReviewForm = new FormGroup({
            id: new FormControl(this.data.review.id ? this.data.review.id : ''),
            listing_id: new FormControl(this.data.listing_id, Validators.required),
            user_id: new FormControl(this.data.user_id, Validators.required),
            rating: new FormControl(this.data.review.rating ? this.data.review.rating : 10, Validators.required),
            title: new FormControl(this.data.review.title ? this.data.review.title : '', Validators.required),
            description: new FormControl(this.data.review.description ? this.data.review.description : '', Validators.required),
          });
    }

    onCkeditorReady(editor: DocumentEditor): void {
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
    }

    onSubmit() {

        // reset form error
        this.showError = false;
        this.errorMessage = '';

        // show spinner
        this.spinnerService.show();

        if(this.data.review.id && this.data.review.id != ''){
          const subscriptionEditReview = this.listingService.editReview(this.listingReviewForm.value).subscribe(
            (res:any) => {
              this.spinnerService.hide();
              this.snackbar.openSnackBar(res.message);

              this.dialogRef.close();
            },
            (res:any) => {
              this.spinnerService.hide();

              this.showError = true;
              this.errorMessage = res.error.message;
            }
          );
          this.subscriptions.add(subscriptionEditReview);
        }
        else{
          const subscriptionNewReview = this.listingService.newReview(this.listingReviewForm.value).subscribe(
            (res:any) => {
              this.spinnerService.hide();
              this.snackbar.openSnackBar(res.message);

              this.dialogRef.close();
            },
            (res:any) => {
              this.spinnerService.hide();

              this.showError = true;
              this.errorMessage = res.error.message;
            }
          );
          this.subscriptions.add(subscriptionNewReview);
        }



    }


    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }

}
