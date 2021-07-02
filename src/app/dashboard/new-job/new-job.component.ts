import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HelperService } from 'src/app/shared/helper.service';

declare const google: any;

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss'],
})
export class NewJobComponent implements OnInit, OnDestroy {
  jobIndustrys = [
    { value: 'Arts & Media', viewValue: 'Arts & Media' },
    { value: 'Education', viewValue: 'Education' },
    {
      value: 'Accounting/ Finance/ Legal',
      viewValue: 'Accounting/ Finance/ Legal',
    },
    { value: 'Medical/Healthcare', viewValue: 'Medical/Healthcare' },
    { value: 'Business Services', viewValue: 'Business Services' },
    { value: 'Retail/Sales', viewValue: 'Retail/Sales' },
    { value: 'Information Technology', viewValue: 'Information Technology' },
    { value: 'Other', viewValue: 'Other' },
  ];
  jobTypes = [
    { value: 'contract', viewValue: 'Contract' },
    { value: 'full-time', viewValue: 'Full Time' },
    { value: 'internship', viewValue: 'Internship' },
    { value: 'part-time', viewValue: 'Part Time' },
    { value: 'temporary', viewValue: 'Temporary' },
  ];
  jobApplyTypes = [
    { value: 'internal', viewValue: 'Internal (Receive Applications Here)' },
    { value: 'external', viewValue: 'External URL' },
    { value: 'with_email', viewValue: 'By Email' },
  ];
  jobExperiences = [
    { value: 'no-experience', viewValue: 'No Experience' },
    { value: 'less-than-1-year', viewValue: 'Less Than 1 Year' },
    { value: '2-years', viewValue: '2 Years' },
    { value: '3-years', viewValue: '3 Years' },
    { value: '4-years', viewValue: '4 Years' },
    { value: '5-years', viewValue: '5 Years' },
    { value: '6-years', viewValue: '6 Years' },
    { value: '7-years', viewValue: '7 Years' },
    { value: '8-years-+', viewValue: '8 Years +' },
  ];

  jobSectors = [];

  subsciptions: Subscription = new Subscription();

  jobForm: FormGroup;
  showError = false;
  errorMessage = '';
  progressAttachment: number = 0;

  formCustomvalidation = {
    attachment: {
      validated: true,
      message: '',
    },
  };

  ckEditor = ClassicEditor;
  ckConfig = {
    placeholder: 'Job Description',
    height: 200,
    toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList'],
  };

  // convenience getter for easy access to form fields
  get f() {
    return this.jobForm.controls;
  }

  constructor(
    private jobService: JobService,
    private uploadService: UploadService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private cdk: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getJobServices();
    this.initializeGoogleMap();
  }

  initializeForm() {
    this.jobForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      deadline: new FormControl('', Validators.required),
      job_sector_id: new FormControl('', Validators.required),
      job_type: new FormControl('', Validators.required),
      job_apply_type: new FormControl(''),
      job_industry: new FormControl(''),
      experience: new FormControl(''),
      salary: new FormControl(5000, Validators.required),

      address: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),

      attachment: new FormControl(''),
    });
  }

  initializeGoogleMap() {
    const latitude = this.jobForm.get('latitude');
    const longitude = this.jobForm.get('longitude');

    const mapProp = {
      zoom: 10,
      scrollwheel: true,
      zoomControl: true,
    };

    const map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const geocoder = new google.maps.Geocoder();
    const input = document.querySelector('input[formControlName=address]') as HTMLInputElement;
    const address = this.jobForm.get('address');
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    let initialLat = parseFloat(latitude.value);
    let initialLng = parseFloat(longitude.value);

    if (initialLat && initialLng) {
      marker.setPosition({ lat: initialLat, lng: initialLng });
    } else {
      initialLat = 52.49840357809672;
      initialLng = -1.4366882483060417;
    }

    map.setCenter({ lat: initialLat, lng: initialLng });

    const autocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
      origin: map.getCenter(),
      strictBounds: false,
    };

    google.maps.event.addListener(map, 'click', (event: any) => {
      let lat = event.latLng.lat(); // lat of clicked point
      let lng = event.latLng.lng(); // lng of clicked point

      const latlng = { lat, lng };

      marker.setPosition(latlng);

      latitude.setValue(lat);
      longitude.setValue(lng);

      geocoder.geocode(
        {
          latLng: latlng,
        },
        (results: any, status: any) => {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              address.setValue(results[0].formatted_address);
            }
          }
        }
      );
    });

    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      // infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      address.setValue(place.formatted_address);
      latitude.setValue(place.geometry.location.lat());
      longitude.setValue(place.geometry.location.lng());

      this.cdk.detectChanges();
    });
  }

  getJobServices() {
    this.spinnerService.show();
    const getSectorsSubscription = this.jobService.getSectors().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.jobSectors = result.data;
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(getSectorsSubscription);
  }

  onAttachmentChange(event) {
    // reset validation
    this.formCustomvalidation.attachment.validated = true;
    this.formCustomvalidation.attachment.message = '';

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.fileValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.attachment.validated = false;
        this.formCustomvalidation.attachment.message = res.message;
        return;
      }

      // send image to the server
      const fd = new FormData();
      fd.append('file', file, file.name);

      this.uploadService.uploadFile(fd, 'job').subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progressAttachment = Math.round((event.loaded / event.total) * 100);
              break;
            case HttpEventType.Response:
              // check for validation
              if (event.body.data.fileValidationError) {
                this.formCustomvalidation.attachment.validated = false;
                this.formCustomvalidation.attachment.message = event.body.data.fileValidationError;
              } else {
                this.jobForm.get('attachment').patchValue(event.body.data.filename);
              }

              // hide progress bar
              console.log('here');
              setTimeout(() => {
                console.log('here 2');
                this.progressAttachment = 0;
              }, 1500);
          }
        },
        (res: any) => {
          console.log(res);
        }
      );
    }
  }

  onSubmit() {
    const formValues = this.jobForm.value;

    this.spinnerService.show();
    const newJobSubscription = this.jobService.newJob(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(newJobSubscription);
  }

  formatSalarySliderLabel(value: number) {
    return Math.round(value / 1000) + 'k';
  }

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
