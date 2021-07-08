import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss'],
})
export class NewJobComponent implements OnInit, AfterViewInit, OnDestroy {
  jobSectors = [];

  subsciptions: Subscription = new Subscription();

  editJobId: number = null;
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

  map: any;
  mapMarker: any;

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
    private route: ActivatedRoute,
    private router: Router,
    public jobService: JobService,
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

    const jobId = this.route.snapshot.paramMap.get('job_id');
    if (jobId != null) {
      this.editJobId = parseInt(jobId);

      this.spinnerService.show();
      this.jobService.getUserJob(this.editJobId).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          this.prepareForm(result.data);
        },
        (error) => {
          this.spinnerService.hide();

          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );
    }
  }

  ngAfterViewInit() {
    const valueChangeSub = this.jobForm.get('job_apply_type').valueChanges.subscribe(val => {
      if (val === 'with_email') {
        this.jobForm.get('job_apply_email').setValidators([Validators.required]);
        this.jobForm.get('external_url').clearValidators();
      } else if (val === 'external') {
        this.jobForm.get('external_url').setValidators([Validators.required]);
        this.jobForm.get('job_apply_email').clearValidators();
      } else {
        this.jobForm.get('job_apply_email').clearValidators();
        this.jobForm.get('external_url').clearValidators();
      }

      this.jobForm.get('job_apply_email').updateValueAndValidity();
      this.jobForm.get('external_url').updateValueAndValidity();

      this.cdk.detectChanges();
    });

    this.subsciptions.add(valueChangeSub);
  }

  initializeForm() {
    this.jobForm = new FormGroup({
      id: new FormControl(''),
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

      job_apply_email: new FormControl(''),
      external_url: new FormControl(''),
    });
  }

  prepareForm(job: any) {
    this.jobForm.patchValue({
      id: job.id,
      title: job.title,
      description: job.description,
      deadline: job.deadline,
      job_sector_id: job.job_sector_id,
      job_type: job.job_type,
      job_apply_type: job.job_apply_type,
      job_industry: job.job_industry,
      experience: job.experience,
      salary: job.salary,

      address: job.address,
      latitude: job.latitude,
      longitude: job.longitude,

      attachment: job.attachment,

      job_apply_email: job.job_meta?.job_apply_email,
      external_url: job.job_meta?.external_url,
    });

    this.map.setCenter({ lat: job.latitude, lng: job.longitude });
    this.mapMarker.setPosition({ lat: job.latitude, lng: job.longitude });
  }

  initializeGoogleMap() {
    const latitude = this.jobForm.get('latitude');
    const longitude = this.jobForm.get('longitude');

    const mapProp = {
      zoom: 10,
      scrollwheel: true,
      zoomControl: true,
    };

    this.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const geocoder = new google.maps.Geocoder();
    const input = document.querySelector('input[formControlName=address]') as HTMLInputElement;
    const address = this.jobForm.get('address');
    this.mapMarker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    let initialLat = 52.49840357809672;
    let initialLng = -1.4366882483060417;

    this.map.setCenter({ lat: initialLat, lng: initialLng });
    this.mapMarker.setPosition({ lat: 23, lng: 90 });

    const autocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
      origin: this.map.getCenter(),
      strictBounds: false,
    };

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      let lat = event.latLng.lat(); // lat of clicked point
      let lng = event.latLng.lng(); // lng of clicked point

      const latlng = { lat, lng };

      this.mapMarker.setPosition(latlng);

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
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      // infowindow.close();
      this.mapMarker.setVisible(false);
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }

      this.mapMarker.setPosition(place.geometry.location);
      this.mapMarker.setVisible(true);

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

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
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
              setTimeout(() => {
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
    if (this.editJobId == null) {
      this.createJob();
    } else {
      this.updateJob();
    }
  }

  createJob() {
    const formValues = this.jobForm.value;
    formValues.deadline = formValues.deadline.toLocaleDateString();

    this.spinnerService.show();
    const newJobSubscription = this.jobService.newJob(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/dashboard/manage-jobs']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(newJobSubscription);
  }

  updateJob() {
    const formValues = this.jobForm.value;
    formValues.deadline = formValues.deadline.toLocaleDateString();

    this.spinnerService.show();
    const updateJobSubscription = this.jobService.editJob(this.editJobId, formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/dashboard/manage-jobs']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(updateJobSubscription);
  }

  formatSalarySliderLabel(value: number) {
    return Math.round(value / 1000) + 'k';
  }

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
