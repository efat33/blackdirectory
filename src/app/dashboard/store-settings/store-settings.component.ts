import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { countries } from './countries';
import { hours, days } from './times';

@Component({
  selector: 'app-store-settings',
  templateUrl: './store-settings.component.html',
  styleUrls: ['./store-settings.component.css'],
})
export class StoreSettingsComponent implements OnInit {
  settingsForm = new FormGroup({
    name: new FormControl(''),
    profile_image: new FormControl(null),
    profile_image_name: new FormControl(null),
    banner_image: new FormControl(null),
    banner_image_name: new FormControl(null),
    product_per_page: new FormControl(10),
    enable_tab: new FormControl(true),
    street: new FormControl(''),
    street_2: new FormControl(''),
    city: new FormControl(''),
    zip: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    phone: new FormControl(''),
    show_email: new FormControl(false),
    uptime: new FormGroup({
      show_uptime: new FormControl(true),
      sunday: new FormGroup({
        up: new FormControl(false),
        opens: new FormControl(''),
        closes: new FormControl(''),
      }),
      monday: new FormGroup({
        up: new FormControl(true),
        opens: new FormControl(''),
        closes: new FormControl(''),
      }),
      tuesday: new FormGroup({
        up: new FormControl(true),
        opens: new FormControl(''),
        closes: new FormControl(''),
      }),
      wednesday: new FormGroup({
        up: new FormControl(true),
        opens: new FormControl(''),
        closes: new FormControl(''),
      }),
      thursday: new FormGroup({
        up: new FormControl(true),
        opens: new FormControl(''),
        closes: new FormControl(''),
      }),
      friday: new FormGroup({
        up: new FormControl(true),
        opens: new FormControl(''),
        closes: new FormControl(''),
      }),
      saturday: new FormGroup({
        up: new FormControl(false),
        opens: new FormControl(''),
        closes: new FormControl(''),
      }),
      open_notice: new FormControl(''),
      close_notice: new FormControl(''),
    }),
  });

  // Show error if any
  showError = false;
  errorMessage = '';
  formCustomvalidation = {
    bannerImage: {
      validated: true,
      message: '',
    },
    profileImage: {
      validated: true,
      message: '',
    },
  };
  bannerImageSrc: string;
  profileImageSrc: string;
  progressProfileImg: number = 0;
  progressBannerImg: number = 0;

  countries: { name: string; code: string }[] = countries;
  hours: string[] = hours;
  days: { label: string; value: string }[] = days;

  constructor(private helperService: HelperService, private uploadService: UploadService) {}

  ngOnInit(): void {}

  getUptimeDayCtrl(day: string): AbstractControl {
    return this.settingsForm.get(`uptime.${day}`);
  }

  onProfileImageChange(event) {
    // reset validation
    this.formCustomvalidation.profileImage.validated = true;
    this.formCustomvalidation.profileImage.message = '';

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.profileImage.validated = false;
        this.formCustomvalidation.profileImage.message = res.message;
        return;
      }

      this.profileImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'user').subscribe((httpEvent: HttpEvent<any>) => {
        switch (httpEvent.type) {
          case HttpEventType.UploadProgress:
            this.progressProfileImg = Math.round((httpEvent.loaded / httpEvent.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (httpEvent.body.data.fileValidationError) {
              this.formCustomvalidation.profileImage.validated = false;
              this.formCustomvalidation.profileImage.message = httpEvent.body.data.fileValidationError;
            } else {
              this.settingsForm.get('profile_image_name').patchValue(httpEvent.body.data.filename);
            }
            // hide progress bar
            setTimeout(() => {
              this.progressProfileImg = 0;
            }, 1500);
        }
      });
    }
  }

  onBannerImageChange(event) {
    // reset validation
    this.formCustomvalidation.bannerImage.validated = true;
    this.formCustomvalidation.bannerImage.message = '';

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.bannerImage.validated = false;
        this.formCustomvalidation.bannerImage.message = res.message;
        return;
      }

      this.bannerImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'user').subscribe((httpEvent: HttpEvent<any>) => {
        switch (httpEvent.type) {
          case HttpEventType.UploadProgress:
            this.progressBannerImg = Math.round((httpEvent.loaded / httpEvent.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (httpEvent.body.data.fileValidationError) {
              this.formCustomvalidation.bannerImage.validated = false;
              this.formCustomvalidation.bannerImage.message = httpEvent.body.data.fileValidationError;
            } else {
              this.settingsForm.get('banner_image_name').patchValue(httpEvent.body.data.filename);
            }

            // hide progress bar
            setTimeout(() => {
              this.progressBannerImg = 0;
            }, 1500);
        }
      });
    }
  }

  onSubmit(): void {
    console.log(this.settingsForm.value);
  }
}
