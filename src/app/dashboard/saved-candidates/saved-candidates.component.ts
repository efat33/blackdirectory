import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/jobs/jobs.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-saved-candidates',
  templateUrl: './saved-candidates.component.html',
  styleUrls: ['./saved-candidates.component.css'],
})
export class SavedCandidatesComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  savedCandidates: any[] = [];

  constructor(
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private jobService: JobService,
    private snackbar: SnackBarService) {}

  ngOnInit() {
    this.getSavedCandidates();
  }

  getSavedCandidates() {
    if (this.helperService.currentUserInfo?.role != 'employer') {
      return;
    }

    this.spinnerService.show();
    const getCandidatesSubs = this.jobService.getSavedCandidates().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.savedCandidates = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(getCandidatesSubs);
  }

  getUserProfilePicture(user: any) {
    if (user.candidate_profile_photo) {
      return this.helperService.getImageUrl(user.candidate_profile_photo, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  deleteSavedCandidate(candidate: any, index: number) {
    this.spinnerService.show();
    const saveCandidateSubscription = this.jobService.deleteSavedCandidate(candidate.candidate_id).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar('Candidate unsaved successfully');

        this.savedCandidates.splice(index, 1);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(saveCandidateSubscription);
  }

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
