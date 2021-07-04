import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactEmployerModal } from 'src/app/modals/job/contact-employer/contact-employer-modal';
import { JobApplyEmailModal } from 'src/app/modals/job/jobapply-email/jobapply-email-modal';
import { JobApplyInternalModal } from 'src/app/modals/job/jobapply-internal/jobapply-internal-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { JobService } from '../jobs.service';

declare const google: any;

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  dialogJobApplyModal: any;

  job: any = {};

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private jobService: JobService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('job-slug');

    this.spinnerService.show();
    const getJobSubscription = this.jobService.getJob(slug).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.job = result.data;
        this.processJob();
        this.initializeGoogleMap();

        console.log(this.job);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );
  }

  processJob() {
    this.job.job_type = this.jobService.jobTypes.find((type) => type.value === this.job.job_type).viewValue;
    this.job.job_industry = this.jobService.jobIndustrys.find(
      (industry) => industry.value === this.job.job_industry
    ).viewValue;
    this.job.job_apply_type = this.jobService.jobApplyTypes.find(
      (type) => type.value === this.job.job_apply_type
    ).viewValue;
    this.job.experience = this.jobService.jobExperiences.find(
      (experience) => experience.value === this.job.experience
    ).viewValue;

    if (this.job.user.profile_photo) {
      this.job.user.profile_photo = this.helperService.getImageUrl(this.job.user.profile_photo, 'users', 'thumb');
    } else {
      this.job.user.profile_photo = 'assets/img/avatar-default.png';
    }

    if (this.job.user.cover_photo) {
      this.job.user.cover_photo = this.helperService.getImageUrl(this.job.user.cover_photo, 'users');
    }
  }

  initializeGoogleMap() {
    if (!(this.job.latitude && this.job.longitude)) {
      return;
    }

    const mapProp = {
      zoom: 15,
      scrollwheel: true,
      zoomControl: true,
    };

    const latlng = { lat: this.job.latitude, lng: this.job.longitude };

    const map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const mapMarker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    map.setCenter(latlng);
    mapMarker.setPosition(latlng);
  }

  applyForJob(): void {
    console.log(this.job.job_meta);
    if (this.job.job_apply_type == 'External URL') {
      window.open(this.job.job_meta?.external_url, "_blank");
    } else if (this.job.job_apply_type == 'By Email') {
      this.dialogJobApplyModal = this.dialog.open(JobApplyEmailModal, {
        width: '550px',
        data: {
          email: this.job.job_meta?.job_apply_email
        }
      });
    } else {
      // internal
      this.dialogJobApplyModal = this.dialog.open(JobApplyInternalModal, {
        width: '550px',
      });
    }
  }

  openContactEmployerModal(): void {
    this.dialogJobApplyModal = this.dialog.open(ContactEmployerModal, {
      width: '550px',
    });
  }

  ngOnDestroy() {}
}
