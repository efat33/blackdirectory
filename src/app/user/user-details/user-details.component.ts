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

declare const google: any;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

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

  reviewForm: FormGroup;
  reviews: any[] = [];

  candidateSaved: boolean = false;
  followingEmployer: boolean = false;

  activeJobsCount: number;
  activeJobs: any[] = [];
  page: number = 1;
  favoriteJobIds = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public helperService: HelperService,
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
    this.setupReviewForm();
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

        this.getReviews();

        if (this.helperService.isEmployer()) {
          this.getSavedCandidates();
          this.getActiveJobsCount();
          this.getActiveJobs();
        } else if (this.helperService.isCandidate()) {
          this.getFollowingEmployers();
          this.getFavoriteJobs();
        }

        this.initializeGoogleMap();
      },
      (res: any) => {
        // if unauthorised, then logout and redirect to home page
        if (res.status == 401) {
          this.userService.logout();
        }
      }
    );

    this.subscriptions.add(getUserSubscription);
  }

  initializeGoogleMap() {
    if (!(this.currentUser.latitude && this.currentUser.longitude)) {
      return;
    }

    const mapProp = {
      zoom: 15,
      scrollwheel: true,
      zoomControl: true,
    };

    const lat = parseFloat(this.currentUser.latitude);
    const lng = parseFloat(this.currentUser.longitude);

    const latlng = { lat, lng };

    const map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const mapMarker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    map.setCenter(latlng);
    mapMarker.setPosition(latlng);
  }

  getReviews() {
    this.spinnerService.show();

    const getReviewsSubscription = this.userService.getReviews(this.currentUser.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.reviews = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getReviewsSubscription);
  }

  getSavedCandidates() {
    if (!this.helperService.isEmployer()) {
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

    this.subscriptions.add(getCandidatesSubs);
  }

  getFollowingEmployers() {
    if (!this.helperService.isCandidate()) {
      return;
    }

    this.spinnerService.show();
    const subscription = this.userService.getFollowingEmployers().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        if (result.data.length > 0) {
          const employer = result.data.find((data: any) => data.employer_id == this.currentUser.id);

          if (employer) {
            this.followingEmployer = true;
          }
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  populateData(): void {
    if (this.currentUser.profile_photo)
      this.profileImage = this.helperService.getImageUrl(this.currentUser.profile_photo, 'users', 'medium');
    if (this.currentUser.cover_photo)
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

  setupReviewForm() {
    this.reviewForm = new FormGroup({
      review: new FormControl('', Validators.required),
      rating_quality: new FormControl(1, Validators.required),
      rating_communication: new FormControl(1, Validators.required),
      rating_goodwill: new FormControl(1, Validators.required),
      rating_overall: new FormControl(1, Validators.required),
    });
  }

  updateSaveCandidateStatus() {
    if (!this.helperService.isEmployer()) {
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

    this.subscriptions.add(saveCandidateSubscription);
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

    this.subscriptions.add(saveCandidateSubscription);
  }

  onSubmitCandidate() {}

  onSubmitEmployer() {}

  onReviewSubmit() {
    const review = this.reviewForm.value;

    this.spinnerService.show();
    const reviewSubscription = this.userService.newReview(this.currentUser.id, review).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar('Review Added');

        this.getReviews();
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(reviewSubscription);
  }

  setRating(rating: number, control: string) {
    this.reviewForm.get(control).setValue(rating);

    const overallRating =
      (parseInt(this.reviewForm.value.rating_quality) +
        parseInt(this.reviewForm.value.rating_communication) +
        parseInt(this.reviewForm.value.rating_goodwill)) /
      3;

    this.reviewForm.get('rating_overall').setValue(Math.round(overallRating * 10) / 10);
  }

  ifShowAddReviewForm() {
    if (!this.helperService.currentUserInfo) {
      return false;
    }

    if (this.helperService.currentUserInfo?.id == this.currentUser?.id) {
      return false;
    }

    return true;
  }

  getUserProfilePicture(profilePhoto: string) {
    if (profilePhoto) {
      return this.helperService.getImageUrl(profilePhoto, 'users', 'thumb');
    }

    return 'assets/img/avatar-default.png';
  }

  showDetailRating(detailElement: any) {
    detailElement.style.display = 'block';
  }

  hideDetailRating(detailElement: any) {
    detailElement.style.display = 'none';
  }

  scrollIntoView(element: any) {
    try {
      window.scrollTo({ left: 0, top: element.offsetTop - 20, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, element.offsetTop - 20);
    }
  }

  followEmployer() {
    if (!this.helperService.currentUserInfo) {
      this.snackbar.openSnackBar('Requires login', 'Close', 'warn');

      return;
    }

    if (this.helperService.currentUserInfo.id === this.currentUser.id) {
      this.snackbar.openSnackBar('Cannot follow yourself', 'Close', 'warn');

      return;
    }

    this.spinnerService.show();

    if (this.followingEmployer) {
      const subscription = this.userService.unfollowEmployer(this.currentUser.id).subscribe(
        (result: any) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar('Employer unfollowed');

          this.followingEmployer = false;
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

      this.subscriptions.add(subscription);
    } else {
      const subscription = this.userService.followEmployer(this.currentUser.id).subscribe(
        (result: any) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar('Following successful');

          this.followingEmployer = true;
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

      this.subscriptions.add(subscription);
    }
  }

  getActiveJobs() {
    const filter = {
      user_id: this.currentUser.id,
    };

    this.spinnerService.show();
    const subscription = this.jobService.getJobs(filter, this.page, 5).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.activeJobs.push(...result.data);
        this.page++;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getActiveJobsCount() {
    const filter = {
      user_id: this.currentUser.id,
    };

    this.spinnerService.show();
    const subscription = this.jobService.getJobCount(filter).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.activeJobsCount = result.data.count;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getJobType(job: any) {
    const jobType = this.jobService.jobTypes.find((type) => type.value === job.job_type)?.viewValue;

    return jobType || '';
  }

  getFavoriteJobs() {
    if (!this.helperService.isCandidate()) {
      return;
    }

    this.spinnerService.show();
    const getFavoriteJobsSubs = this.jobService.getFavoriteJobs().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.favoriteJobIds = result.data.map((favJob) => favJob.job_id);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getFavoriteJobsSubs);
  }

  isFavoriteJob(job: any) {
    return this.favoriteJobIds.includes(job.id);
  }

  updateFavoriteJob(job: any) {
    if (!this.helperService.isCandidate()) {
      this.snackbar.openSnackBar(`Requires 'Candidate' login`, 'Close', 'warn');
      return;
    }

    if (this.isFavoriteJob(job)) {
      this.deleteFavoriteJob(job);
    } else {
      this.saveFavoriteJob(job);
    }
  }

  saveFavoriteJob(job: any) {
    this.spinnerService.show();
    const saveFavoriteSubscription = this.jobService.saveFavoriteJob(job.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Job saved as favorite');

        this.favoriteJobIds.push(job.id);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(saveFavoriteSubscription);
  }

  deleteFavoriteJob(job: any) {
    this.spinnerService.show();
    const saveFavoriteSubscription = this.jobService.deleteFavoriteJob(job.id).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Job removed from favorites');

        const index = this.favoriteJobIds.indexOf(job.id);
        this.favoriteJobIds.splice(index, 1);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(saveFavoriteSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
