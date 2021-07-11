import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from '../user.service';
import { CurrentUser } from '../user';
import { Sector } from '../../jobs/jobs';
import { JobService } from 'src/app/jobs/jobs.service';
import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  username: string;
  userType: string;
  currentUser: CurrentUser;
  userMeta: any;
  userProfile: any;
  profileImage: string = `${this.helperService.siteUrl}/assets/img/avatar-default.png`;
  coverImage: string;
  candidateInfo: any;
  employerInfo: any;
  academics: string[];

  contactCandidateForm: FormGroup;
  showCandidateError = false;
  errorMessageCandidate = '';

  contactEmployerForm: FormGroup;
  showEmployerError = false;
  errorMessageEmployer = '';

  candidateSaved: boolean = false;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private helperService: HelperService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private jobService: JobService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');

    if (!this.username) {
      this.router.navigate(['/']);
    }

    this.setupContactForm();
    this.getUserDetails();

  }

  getUserDetails() {
    // show spinner, wait until user data is fetched
    this.spinnerService.show();

    // get current user detail
    const getUserSubscription = this.userService.getDetails(this.username).subscribe(
      (res: any) => {
        this.currentUser = res.data.data;
        this.userType = res.data.data.role;
        this.userMeta = this.helperService.prepareMetaData(res.data.meta_data);
        this.userProfile = res.data;

        // populdate data
        this.populateData();

        // hide spinner
        this.spinnerService.hide();

        if(this.helperService.currentUserInfo?.role === 'employer') {
          this.getSavedCandidates();
        }
      },
      (res: any) => {
        // if unauthorised, then logout and redirect to home page
        if (res.status == 401) {
          this.userService.logout();
        }
      }
    );

    this.subsciptions.add(getUserSubscription);
  }

  getSavedCandidates() {
    if (this.helperService.currentUserInfo?.role != 'employer') {
      return;
    }

    this.spinnerService.show();
    const getCandidatesSubs = this.jobService.getSavedCandidates().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (result.data.length > 0) {
          const candidate = result.data.find((data: any) => data.candidate_id == this.currentUser.id);

          if (candidate) {
            this.candidateSaved = true;
          }
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(getCandidatesSubs);
  }

  populateData(): void {
    if (this.currentUser.profile_photo != '')
      this.profileImage = this.helperService.getImageUrl(this.currentUser.profile_photo, 'users', 'medium');
    if (this.currentUser.cover_photo != '')
      this.coverImage = this.helperService.getImageUrl(this.currentUser.cover_photo, 'users');
    if (this.userMeta.academics) this.academics = JSON.parse(this.userMeta.academics);

    // set image url in portfolios array
    if (this.userProfile.portfolios) {
      this.userProfile.portfolios.map((portfolio) => {
        portfolio.image = this.helperService.getImageUrl(portfolio.image, 'users', 'thumb');
      });
    }
  }

  setupContactForm(): void {
    this.contactCandidateForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', Validators.required),
      phone: new FormControl(''),
      message: new FormControl('', Validators.required),
    });
    this.contactEmployerForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', Validators.required),
      phone: new FormControl(''),
      message: new FormControl('', Validators.required),
    });
  }

  updateSaveCandidateStatus() {
    if (this.helperService.currentUserInfo?.role !== 'employer') {
      this.snackbar.openSnackBar(`Requires 'Employer' login`, 'Close', 'warn');
      return;
    }

    if (this.candidateSaved) {
      this.deleteSavedCandidate();
    } else {
      this.saveCandidate();
    }
  }

  saveCandidate() {
    this.spinnerService.show();
    const saveCandidateSubscription = this.jobService.saveCandidate(this.currentUser.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Candidate saved successfully');
        this.candidateSaved = true;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(saveCandidateSubscription);
  }

  deleteSavedCandidate() {
    this.spinnerService.show();
    const saveCandidateSubscription = this.jobService.deleteSavedCandidate(this.currentUser.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Candidate unsaved successfully');
        this.candidateSaved = false;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subsciptions.add(saveCandidateSubscription);
  }

  onSubmitCandidate() {}

  onSubmitEmployer() {}

  ngOnDestroy() {
    this.subsciptions.unsubscribe();
  }
}
