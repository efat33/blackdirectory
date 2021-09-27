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
import { UserService } from 'src/app/user/user.service';
import { JobService } from '../jobs.service';

declare const google: any;

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  job: any = {};
  coverLetter: string;

  applied: boolean = false;
  isJobFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private jobService: JobService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private helperService: HelperService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('job-slug');

    this.getJobDetails(slug);

    if (this.helperService.currentUserInfo) {
      this.getUserDetails();
    }
  }

  getJobDetails(slug: string) {
    this.spinnerService.show();
    const getJobSubscription = this.jobService.getJob(slug).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.job = result.data;
        this.processJob();
        this.initializeGoogleMap();

        if (this.helperService.currentUserInfo) {
          this.getUserApplicationStatus(this.job.id);
        }
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getJobSubscription);
  }

  getUserApplicationStatus(jobId: number) {
    this.spinnerService.show();
    const userApplicationSubscription = this.jobService.getUserApplicationStatus(jobId).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (result.data.length) {
          this.applied = true;
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(userApplicationSubscription);
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

  getUserDetails() {
    this.spinnerService.show();
    const getUserSubscription = this.userService.getDetails(this.helperService.currentUserInfo.username).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.coverLetter = result.data.meta_data?.find((data: any) => data.meta_key === 'cover_letter')?.meta_value;

        if (this.helperService.isCandidate()) {
          this.getFavoriteJobs();
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getUserSubscription);
  }

  getFavoriteJobs() {
    if (!this.helperService.isCandidate()) {
      return;
    }

    this.spinnerService.show();
    const getFavoriteJobsSubs = this.jobService.getFavoriteJobs().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (result.data.length > 0) {
          const job = result.data.find((data: any) => data.job_id == this.job.id);

          if (job) {
            this.isJobFavorite = true;
          }
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getFavoriteJobsSubs);
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
    if (this.job.job_apply_type == 'External URL') {
      window.open(this.job.job_meta?.external_url, '_blank');
      return;
    }

    if (!this.helperService.isCandidate()) {
      this.snackbar.openSnackBar('Requires "Candidate" login', 'Close', 'warn');
      return;
    }

    if (this.job.job_apply_type == 'By Email') {
      const dialogConfig = {
        width: '550px',
        data: {
          job: this.job,
        },
      };

      const dialogSubscription = this.dialog
        .open(JobApplyEmailModal, dialogConfig)
        .afterClosed()
        .subscribe((result: any) => {
          if (result) {
            this.applied = true;
            this.snackbar.openSnackBar('Applied successfully');
          }
        });

      this.subscriptions.add(dialogSubscription);
    } else {
      // internal
      const dialogConfig = {
        width: '550px',
        data: {
          coverLetter: this.coverLetter,
        },
      };

      const dialogSubscription = this.dialog
        .open(JobApplyInternalModal, dialogConfig)
        .afterClosed()
        .subscribe((result: any) => {
          if (result) {
            this.createInternalJobApplication(result);
          }
        });

      this.subscriptions.add(dialogSubscription);
    }
  }

  openContactEmployerModal(): void {
    this.dialog.open(ContactEmployerModal, {
      width: '550px',
      data: { to: this.job.user.email },
    });
  }

  createInternalJobApplication(coverLetter: string) {
    const body = {
      job_id: this.job.id,
      employer_id: this.job.user_id,
      cover_letter: coverLetter,
    };

    this.spinnerService.show();
    const newJobSubscription = this.jobService.newJobApplication(body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.applied = true;
        this.snackbar.openSnackBar('Applied successfully');
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newJobSubscription);
  }

  isDeadlineOver(job: any) {
    return new Date(job.deadline).getTime() < Date.now();
  }

  updateFavoriteJob() {
    if (!this.helperService.isCandidate()) {
      this.snackbar.openSnackBar(`Requires 'Candidate' login`, 'Close', 'warn');
      return;
    }

    if (this.isJobFavorite) {
      this.deleteFavoriteJob();
    } else {
      this.saveFavoriteJob();
    }
  }

  saveFavoriteJob() {
    this.spinnerService.show();
    const saveFavoriteSubscription = this.jobService.saveFavoriteJob(this.job.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Job saved as favorite');
        this.isJobFavorite = true;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(saveFavoriteSubscription);
  }

  deleteFavoriteJob() {
    this.spinnerService.show();
    const saveFavoriteSubscription = this.jobService.deleteFavoriteJob(this.job.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Job removed from favorites');
        this.isJobFavorite = false;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(saveFavoriteSubscription);
  }

  ngOnDestroy() {}
}
