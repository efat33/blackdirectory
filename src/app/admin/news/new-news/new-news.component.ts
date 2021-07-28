import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HelperService } from 'src/app/shared/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

declare const google: any;

@Component({
  selector: 'app-new-news',
  templateUrl: './new-news.component.html',
  styleUrls: ['./new-news.component.scss'],
})
export class NewNewsComponent implements OnInit, AfterViewInit, OnDestroy {
  jobSectors = [];

  subscriptions: Subscription = new Subscription();

  editJobId: number = null;
  jobForm: FormGroup;
  showError = false;
  errorMessage = '';
  progressAttachment: number = 0;

  minDeadlineDate = new Date();
  maxDeadlineDate: any = new Date();

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
  }

  ngAfterViewInit() {
    const valueChangeSub = this.jobForm.get('job_apply_type').valueChanges.subscribe((val) => {
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

    this.subscriptions.add(valueChangeSub);
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

    this.subscriptions.add(newJobSubscription);
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

    this.subscriptions.add(updateJobSubscription);
  }

  formatSalarySliderLabel(value: number) {
    return Math.round(value / 1000) + 'k';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
