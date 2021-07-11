import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from '../user.service';
import { CurrentUser } from "../user";
import { Sector } from "../../jobs/jobs";
import { JobService } from 'src/app/jobs/jobs.service';
import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  userType:string;
  currentUser: CurrentUser;
  userMeta: any;
  userProfile: any;
  profileImage:string = `${this.helperService.siteUrl}/assets/img/avatar-default.png`;
  coverImage:string;
  candidateInfo: any;
  employerInfo: any;
  academics: string[];

  contactCandidateForm: FormGroup;
  showCandidateError = false;
  errorMessageCandidate = '';

  contactEmployerForm: FormGroup;
  showEmployerError = false;
  errorMessageEmployer = '';

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private helperService: HelperService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private jobService: JobService
  ) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');

    if (!username) {
      this.router.navigate(['/']);
    }

    this.setupContactForm();

    // show spinner, wait until user data is fetched
    this.spinnerService.show();

    // get current user detail
    this.userService.getDetails(username).subscribe(
      (res: any) => {
        this.currentUser = res.data.data;
        this.userType = res.data.data.role;
        this.userMeta = this.helperService.prepareMetaData(res.data.meta_data);
        this.userProfile = res.data;

        // populdate data
        this.populateData();

        // hide spinner
        this.spinnerService.hide();
      },
      (res: any) => {
        // if unauthorised, then logout and redirect to home page
        if(res.status == 401){
          this.userService.logout();
        }
      }

    );


  }

  populateData():void {

    if(this.currentUser.profile_photo != '') this.profileImage = this.helperService.getImageUrl(this.currentUser.profile_photo, 'users', 'medium')
    if(this.currentUser.cover_photo != '') this.coverImage = this.helperService.getImageUrl(this.currentUser.cover_photo, 'users')
    if(this.userMeta.academics) this.academics = JSON.parse(this.userMeta.academics);

    // set image url in portfolios array
    if(this.userProfile.portfolios){
      this.userProfile.portfolios.map(portfolio => {
        portfolio.image = this.helperService.getImageUrl(portfolio.image, 'users', 'thumb');
      });
    }

  }

  setupContactForm():void {
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

  onSubmitCandidate() {

  }

  onSubmitEmployer() {

  }


  ngOnDestroy() {

  }


}



