import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewsService } from 'src/app/news/news.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';
import { MobilesService } from 'src/app/mobiles/mobiles.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'add-mobile-providers-modal',
  templateUrl: 'add-mobile-providers-modal.html',
  styleUrls: ['add-mobile-providers-modal.scss'],
})
export class AddMobileProviderModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  mobileProviderForm: FormGroup;
  provider: any = {};

  progressImage: number = 0;
  logoSrc: string = '';

  formCustomvalidation = {
    logo: {
      validated: true,
      message: '',
    },
  };

  constructor(
    private dialogRef: MatDialogRef<AddMobileProviderModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private mobilesService: MobilesService,
    private helperService: HelperService,
    private uploadService: UploadService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.provider = this.data?.provider || {};
  }

  ngOnInit(): void {
    this.mobileProviderForm = new FormGroup({
      title: new FormControl(this.provider.title || '', Validators.required),
      logo: new FormControl(this.provider.logo, Validators.required),
    });

    this.getImageSrc();
  }

  getImageSrc() {
    if (this.provider.logo) {
      this.logoSrc = this.helperService.getImageUrl(this.provider.logo, 'mobiles', 'thumb');
    }
  }

  onSubmit() {
    if (this.provider.id) {
      this.editProvider();
    } else {
      this.addProvider();
    }
  }

  addProvider() {
    this.spinnerService.show();
    const subscription = this.mobilesService.addMobileProvider(this.mobileProviderForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Provider added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editProvider() {
    this.spinnerService.show();
    const subscription = this.mobilesService.updateMobileProvider(this.provider.id, this.mobileProviderForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Provider updated');
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
    this.formCustomvalidation.logo.validated = true;
    this.formCustomvalidation.logo.message = '';

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.logo.validated = false;
        this.formCustomvalidation.logo.message = res.message;
        return;
      }

      this.logoSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'mobiles').subscribe((result: HttpEvent<any>) => {
        switch (result.type) {
          case HttpEventType.UploadProgress:
            this.progressImage = Math.round((result.loaded / result.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (result.body.data.fileValidationError) {
              this.formCustomvalidation.logo.validated = false;
              this.formCustomvalidation.logo.message = result.body.data.fileValidationError;
            } else {
              this.mobileProviderForm.get('logo').patchValue(result.body.data.filename);
            }

            // hide progress bar
            setTimeout(() => {
              this.progressImage = 0;
            }, 1500);
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
