import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-favorite-jobs',
  templateUrl: './favorite-jobs.component.html',
  styleUrls: ['./favorite-jobs.component.css'],
})
export class FavoriteJobsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  favoriteJobs: any[] = [];

  constructor(
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private jobService: JobService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getFavoriteJobs();
  }

  getFavoriteJobs() {
    if (!this.helperService.isCandidate()) {
      return;
    }

    this.spinnerService.show();
    const getCandidatesSubs = this.jobService.getFavoriteJobs().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.favoriteJobs = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getCandidatesSubs);
  }

  getUserProfilePicture(job: any) {
    if (job.employer_profile_photo) {
      return this.helperService.getImageUrl(job.employer_profile_photo, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  deleteFavoriteJob(job: any, index: number) {
    this.spinnerService.show();
    const saveCandidateSubscription = this.jobService.deleteFavoriteJob(job.job_id).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar('Job removed from favorites');

        this.favoriteJobs.splice(index, 1);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(saveCandidateSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
