import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { ListingService } from 'src/app/listing/listing.service';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'add-listing-category-modal',
  templateUrl: 'add-listing-category-modal.html',
  styleUrls: ['./add-listing-category-modal.scss'],
})
export class AddListingCategoryModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  listingCategoryForm: FormGroup;
  category: any = {};

  progressImage: number = 0;
  progressFeaturedImage: number = 0;
  imageSrc: string = '';
  featuredImageSrc: string = '';

  formCustomvalidation = {
    image: {
      validated: true,
      message: '',
    },
    featured_image: {
      validated: true,
      message: '',
    },
  };

  constructor(
    private dialogRef: MatDialogRef<AddListingCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private listingService: ListingService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private uploadService: UploadService,
    private snackbar: SnackBarService
  ) {
    this.category = this.data?.category || {};
  }

  ngOnInit(): void {
    this.listingCategoryForm = new FormGroup({
      title: new FormControl(this.category.title || '', Validators.required),
      image: new FormControl(this.category.image, Validators.required),
      featured_image: new FormControl(this.category.featured_image),
    });

    this.getImageSrc();
  }

  getImageSrc() {
    if (this.category.image) {
      this.imageSrc = this.helperService.getImageUrl(this.category.image, 'listing', 'thumb');
    }
    if (this.category.featured_image) {
      this.featuredImageSrc = this.helperService.getImageUrl(this.category.featured_image, 'listing', 'thumb');
    }
  }

  onSubmit() {
    if (this.category.id) {
      this.editCategory();
    } else {
      this.addCategory();
    }
  }

  addCategory() {
    this.spinnerService.show();
    const subscription = this.listingService.addListingCategory(this.listingCategoryForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Category added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editCategory() {
    this.spinnerService.show();
    const subscription = this.listingService.updateListingCategory(this.category.id, this.listingCategoryForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Category updated');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  onAttachmentChange(event: any) {
    // reset validation
    this.formCustomvalidation.image.validated = true;
    this.formCustomvalidation.image.message = '';

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.image.validated = false;
        this.formCustomvalidation.image.message = res.message;
        return;
      }

      this.imageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((result: HttpEvent<any>) => {
        switch (result.type) {
          case HttpEventType.UploadProgress:
            this.progressImage = Math.round((result.loaded / result.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (result.body.data.fileValidationError) {
              this.formCustomvalidation.image.validated = false;
              this.formCustomvalidation.image.message = result.body.data.fileValidationError;
            } else {
              this.listingCategoryForm.get('image').patchValue(result.body.data.filename);
            }

            // hide progress bar
            setTimeout(() => {
              this.progressImage = 0;
            }, 1500);
        }
      });
    }
  }

  onFeaturedImageChange(event: any) {
    // reset validation
    this.formCustomvalidation.featured_image.validated = true;
    this.formCustomvalidation.featured_image.message = '';

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.featured_image.validated = false;
        this.formCustomvalidation.featured_image.message = res.message;
        return;
      }

      this.featuredImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((result: HttpEvent<any>) => {
        switch (result.type) {
          case HttpEventType.UploadProgress:
            this.progressFeaturedImage = Math.round((result.loaded / result.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (result.body.data.fileValidationError) {
              this.formCustomvalidation.featured_image.validated = false;
              this.formCustomvalidation.featured_image.message = result.body.data.fileValidationError;
            } else {
              this.listingCategoryForm.get('featured_image').patchValue(result.body.data.filename);
            }

            // hide progress bar
            setTimeout(() => {
              this.progressFeaturedImage = 0;
            }, 1500);
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
