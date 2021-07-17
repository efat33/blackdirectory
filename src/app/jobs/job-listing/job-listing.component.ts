import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { JobService } from '../jobs.service';

declare const google: any;

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss'],
})
export class JobListingComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  sectors = [];
  jobs = [];
  jobCount = 0;
  pageSize = 10;

  jobFilterForm: FormGroup;
  showError = false;
  errorMessage = '';

  locationModified = false;

  // convenience getter for easy access to form fields
  get f() {
    return this.jobFilterForm.controls;
  }

  constructor(
    public jobService: JobService,
    public helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.initializeFilterForm();
    this.getJobSectors();
    this.getJobs();
    this.getJobCount();
    this.initializeGoogleMap();
  }

  initializeFilterForm() {
    this.jobFilterForm = new FormGroup({
      keyword: new FormControl(''),
      location: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      loc_radius: new FormControl(50),
      sector: new FormControl(''),
      datePosted: new FormControl(''),
      jobType: new FormControl(''),
      salary: new FormControl([5000, 250000]),
    });
  }

  onSubmit() {
    this.getJobCount();
    this.getJobs(1);
  }

  initializeGoogleMap() {
    const latitude = this.jobFilterForm.get('latitude');
    const longitude = this.jobFilterForm.get('longitude');

    const input = document.querySelector('input[formControlName=location]') as HTMLInputElement;
    const address = this.jobFilterForm.get('location');

    const autocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
    };

    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);

    autocomplete.addListener('place_changed', () => {
      // infowindow.close();
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      address.setValue(place.formatted_address);
      latitude.setValue(place.geometry.location.lat());
      longitude.setValue(place.geometry.location.lng());
      this.locationModified = false;
    });
  }

  onSelectOpen(opened: boolean, searchInput: any) {
    if (opened) {
      searchInput.focus();
    }
  }

  onLocationBlur() {
    if (this.locationModified) {
      this.jobFilterForm.patchValue({
        latitude: '',
        longitude: '',
        location: '',
      });
    }
  }

  getJobSectors() {
    this.spinnerService.show();
    const getSectorsSubscription = this.jobService.getSectors().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.sectors = result.data;
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getSectorsSubscription);
  }

  getJobs(page: number = 1) {
    this.spinnerService.show();
    const getJobsSubscription = this.jobService.getJobs(this.jobFilterForm.value, page, this.pageSize).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.jobs = result.data;
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getJobsSubscription);
  }

  getJobCount() {
    this.spinnerService.show();
    const getJobsSubscription = this.jobService.getJobCount(this.jobFilterForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.jobCount = result.data.count;
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getJobsSubscription);
  }

  filteredJobSectors(searchString: any) {
    if (this.sectors.length > 0) {
      return this.sectors.filter((sector) => sector.title.toLowerCase().includes(searchString.toLowerCase()));
    }

    return [];
  }

  getJobType(job: any) {
    const jobType = this.jobService.jobTypes.find((type) => type.value === job.job_type)?.viewValue;

    return jobType || '';
  }

  onPageChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    this.getJobs(page);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
