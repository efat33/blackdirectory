import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { HelperService } from 'src/app/shared/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { CandidateEducationModal } from "../../modals/user/candidate-education/candidate-education-modal";
import { CandidateExperienceModal } from "../../modals/user/candidate-experience/candidate-experience-modal";
import { CandidatePortfolioModal } from "../../modals/user/candidate-portfolio/candidate-portfolio-modal";
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from "../../modals/confirmation-dialog/confirmation-dialog";
import { UserService } from 'src/app/user/user.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import * as moment from 'moment';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.scss']
})

export class DashboardProfileComponent implements OnInit {

  sectors = [
    { id: 1, value: 'steak-0'},
    { id: 2, value: 'pizza-1'},
    { id: 3, value: 'tacos-2'}
  ];
  publicViews = [
    { value: 1, viewValue: 'Yes'},
    { value: 0, viewValue: 'No'}
  ];
  jobIndustrys = [
    { value: 'Arts & Media', viewValue: 'Arts & Media'},
    { value: 'Education', viewValue: 'Education'},
    { value: 'Accounting/ Finance/ Legal', viewValue: 'Accounting/ Finance/ Legal'},
    { value: 'Medical/Healthcare', viewValue: 'Medical/Healthcare'},
    { value: 'Business Services', viewValue: 'Business Services'},
    { value: 'Retail/Sales', viewValue: 'Retail/Sales'},
    { value: 'Information Technology', viewValue: 'Information Technology'},
    { value: 'Other', viewValue: 'Other'},
  ];
  salaryTypes = [
    { value: 'Monthly', viewValue: 'Monthly'},
    { value: 'Weekly', viewValue: 'Weekly'},
    { value: 'Hourly', viewValue: 'Hourly'},
    { value: 'Annually', viewValue: 'Annually'},
  ];
  candidateAges = [
    { value: '16 - 18 Years', viewValue: '16 - 18 Years'},
    { value: '19 - 22 Years', viewValue: '19 - 22 Years'},
    { value: '23 - 27 Years', viewValue: '23 - 27 Years'},
    { value: '28 - 35 Years', viewValue: '28 - 35 Years'},
    { value: '36 - 45 Years', viewValue: '36 - 45 Years'},
    { value: '46 - 55 Years', viewValue: '46 - 55 Years'},
    { value: '56 - 65 Years', viewValue: '56 - 65 Years'},
    { value: 'Above 65 Years', viewValue: 'Above 65 Years'},
  ];
  candidateGenders = [
    { value: 'Male', viewValue: 'Male'},
    { value: 'Female', viewValue: 'Female'},
    { value: 'Transgender', viewValue: 'Transgender'},
    { value: 'Non-Binary', viewValue: 'Non-Binary'},
    { value: 'Prefer Not To Say', viewValue: 'Prefer Not To Say'},
  ];
  academics = [
    { value: '\GCSE\'s/ Equivalent', viewValue: '\GCSE\'s/ Equivalent'},
    { value: 'A-Levels', viewValue: 'A-Levels'},
    { value: 'Apprenticeship', viewValue: 'Apprenticeship'},
    { value: 'Undergraduate Degree', viewValue: 'Undergraduate Degree'},
    { value: 'Master’s Degree', viewValue: 'Master’s Degree'},
    { value: 'Doctorate', viewValue: 'Doctorate'},
    { value: 'Other', viewValue: 'Other'}
  ];

  subscriptions: Subscription = new Subscription();
  
  profileForm: FormGroup;
  showError = false;
  errorMessage = '';
  formCustomvalidation = {
    profileImage: {
      validated: true,
      message: ''
    },
    coverImage: {
      validated: true,
      message: ''
    },
    candidateCV: {
      validated: true,
      message: ''
    }
  };
  submitted = false;
  profileImageSrc: string;
  coverImageSrc: string;
  userType = 'candidate';
  candidateEducations: FormArray;
  removedEducations: any = [];
  candidateExperiences: FormArray;
  removedExperiences: any = [];
  candidatePortfolios: FormArray;
  removedPortfolios: any = [];

  userDetails: any;
  userMeta: any;
  userProfile: any;

  dialogRefEdu: any;
  dialogRefExp: any;
  dialogRefPort: any;

  // progress variable
  progressProfileImg: number = 0;
  progressCoverImg: number = 0;
  progressCandidateCV: number = 0;

  constructor(
    public dialog: MatDialog,
    private helperservice: HelperService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
    private uploadService: UploadService
    ) { }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  ngOnInit() {
    
    // initiate form fields
    this.setupFormFields();

    // show spinner, wait until user data is fetched
    this.spinnerService.show();

    // get current user detail
    this.userService.getProfile().subscribe(
      (res: any) => {
        this.userDetails = res.data.data;
        this.userMeta = res.data.meta_data;
        this.userProfile = res.data;

        // populate form fields with the existing data
        this.populateFormFields();

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

  populateFormFields() : void {

    // console.log(this.userDetails);
    this.profileForm.patchValue({
      first_name: this.userDetails.first_name,
      last_name: this.userDetails.last_name,
      display_name: this.userDetails.display_name,
      phone: this.userDetails.phone,
      dob: this.userDetails.dob,
      description: this.userDetails.description,
      profile_photo_name: this.userDetails.profile_photo,
      cover_photo_name: this.userDetails.cover_photo,
      pubic_view: this.userDetails.pubic_view,
      job_sectors_id: this.userDetails.job_sectors_id,

      address: this.userDetails.address,
      latitude: this.userDetails.latitude,
      longitude: this.userDetails.longitude,

      facebook_link: this.helperservice.getMetaData(this.userMeta, 'facebook_link'),
      twitter_link: this.helperservice.getMetaData(this.userMeta, 'twitter_link'),
      linkedin_link: this.helperservice.getMetaData(this.userMeta, 'linkedin_link'),
      instagram_link: this.helperservice.getMetaData(this.userMeta, 'instagram_link'),
    });

    if(this.helperservice.currentUserInfo.role == 'candidate'){
      this.profileForm.get('job_title').patchValue(this.helperservice.getMetaData(this.userMeta, 'job_title'));
      this.profileForm.get('job_industry').patchValue(this.helperservice.getMetaData(this.userMeta, 'job_industry'));
      this.profileForm.get('salary_type').patchValue(this.helperservice.getMetaData(this.userMeta, 'salary_type'));
      this.profileForm.get('salary_amount').patchValue(this.helperservice.getMetaData(this.userMeta, 'salary_amount'));
      this.profileForm.get('age').patchValue(this.helperservice.getMetaData(this.userMeta, 'age'));
      this.profileForm.get('gender').patchValue(this.helperservice.getMetaData(this.userMeta, 'gender'));
      this.profileForm.get('availble_now').patchValue(this.helperservice.getMetaData(this.userMeta, 'availble_now'));
      this.profileForm.get('cover_letter').patchValue(this.helperservice.getMetaData(this.userMeta, 'cover_letter'));
    
      if(this.helperservice.getMetaData(this.userMeta, 'academics') != ''){
        this.profileForm.get('academics').patchValue(JSON.parse(this.helperservice.getMetaData(this.userMeta, 'academics')));
      }
    }

    if(this.helperservice.currentUserInfo.role == 'employer'){
      this.profileForm.get('website').patchValue(this.helperservice.getMetaData(this.userMeta, 'website'));
      this.profileForm.get('founded_date').patchValue(this.helperservice.getMetaData(this.userMeta, 'founded_date'));
    }

    // set images url
    if(this.userDetails.profile_photo != ''){
      this.profileImageSrc = this.helperservice.getImageUrl(this.userDetails.profile_photo, 'users', 'thumb');
    }
    if(this.userDetails.cover_photo != ''){
      this.coverImageSrc = this.helperservice.getImageUrl(this.userDetails.cover_photo, 'users', 'thumb');
    }
    
    this.profileForm.get('candidate_cv_name').patchValue(this.helperservice.getMetaData(this.userMeta, 'candidate_cv'));
    
    // set candidate educations
    if(this.userProfile.educations && this.userProfile.educations.length > 0){
      for (const item of this.userProfile.educations) {
        const variationGroup = new FormGroup({
          id: new FormControl(item.id),
          user_id: new FormControl(item.user_id),  
          title: new FormControl(item.title),
          institute: new FormControl(item.institute),
          year: new FormControl(item.year),
          description: new FormControl(item.description),
        });
        this.candidateEducations.push(variationGroup);
      }
    }

    // set candidate experiences
    if(this.userProfile.experiences && this.userProfile.experiences.length > 0){
      for (const item of this.userProfile.experiences) {
        const variationGroup = new FormGroup({
          id: new FormControl(item.id),
          user_id: new FormControl(item.user_id),  
          title: new FormControl(item.title),
          start_date: new FormControl(item.start_date),
          end_date: new FormControl(item.end_date),
          present: new FormControl(item.present),
          company: new FormControl(item.company),
          description: new FormControl(item.description),
        });
        this.candidateExperiences.push(variationGroup);
      }
    }

    // set candidate portfolios
    if(this.userProfile.portfolios && this.userProfile.portfolios.length > 0){
      for (const item of this.userProfile.portfolios) {
        const variationGroup = new FormGroup({
          id: new FormControl(item.id),
          user_id: new FormControl(item.user_id),  
          title: new FormControl(item.title),
          image: new FormControl(''),
          image_name: new FormControl(item.image),
          image_src: new FormControl(this.helperservice.getImageUrl(item.image, 'users', 'medium')),
          youtube_url: new FormControl(item.youtube_url),
        });
        this.candidatePortfolios.push(variationGroup);
      }
    }

  }

  setupFormFields() : void {

    this.profileForm = new FormGroup({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      display_name: new FormControl(''),
      phone: new FormControl(''),
      dob: new FormControl(''),
      description: new FormControl(''),
      profile_photo: new FormControl(''),
      profile_photo_name: new FormControl(''),
      cover_photo: new FormControl(''),
      cover_photo_name: new FormControl(''),
      pubic_view: new FormControl(''),
      job_sectors_id: new FormControl('', Validators.required),

      address: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),

      facebook_link: new FormControl(''),
      twitter_link: new FormControl(''),
      linkedin_link: new FormControl(''),
      instagram_link: new FormControl(''),
      
    });

    // add candidate fields
    if(this.helperservice.currentUserInfo.role == 'candidate'){
      this.profileForm.addControl('job_title', new FormControl(''));
      this.profileForm.addControl('job_industry', new FormControl(''));
      this.profileForm.addControl('salary_type', new FormControl(''));
      this.profileForm.addControl('salary_amount', new FormControl(''));
      this.profileForm.addControl('age', new FormControl(''));
      this.profileForm.addControl('academics', new FormControl(''));
      this.profileForm.addControl('gender', new FormControl(''));
      this.profileForm.addControl('availble_now', new FormControl(''));
      this.profileForm.addControl('cover_letter', new FormControl(''));
      this.profileForm.addControl('candidate_cv', new FormControl(''));
      this.profileForm.addControl('candidate_cv_name', new FormControl(''));

      this.profileForm.addControl('candidateEducations', new FormArray([]));
      this.profileForm.addControl('removedEducations', new FormControl(''));
      this.candidateEducations = this.profileForm.get('candidateEducations') as FormArray;

      this.profileForm.addControl('candidateExperiences', new FormArray([]));
      this.profileForm.addControl('removedExperiences', new FormControl(''));
      this.candidateExperiences = this.profileForm.get('candidateExperiences') as FormArray;

      this.profileForm.addControl('candidatePortfolios', new FormArray([]));
      this.profileForm.addControl('removedPortfolios', new FormControl(''));
      this.candidatePortfolios = this.profileForm.get('candidatePortfolios') as FormArray;

    }

    // add employer fields
    if(this.helperservice.currentUserInfo.role == 'employer'){
      this.profileForm.addControl('website', new FormControl(''));
      this.profileForm.addControl('founded_date', new FormControl(''));
    }
  }

  onSubmit() {
    this.submitted = true;
    const formData = this.profileForm.value;
  
    // remove timezone from date, using moment
    formData.dob = moment(formData.dob).format("YYYY-MM-DD");

    // show spinner
    this.spinnerService.show();

    this.userService.update(formData).subscribe(
      (res: any) => {

        // hide spinner
        this.spinnerService.hide();

        this.snackbar.openSnackBar(res.message);

        setTimeout(() => {
          location.reload();
        }, 2000);

      },
      (res: any) => {
        // hide spinner
        this.spinnerService.hide();

        this.snackbar.openSnackBar(res.message, 'Close', 'warn');
      }
    );

  }

  onProfileImageChange(event) {

    // reset validation
    this.formCustomvalidation.profileImage.validated = true;
    this.formCustomvalidation.profileImage.message = '';

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.profileImage.validated = false;
        this.formCustomvalidation.profileImage.message = res.message;
        return;
      }
      
      this.profileImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("resize", 'yes');
   
      // this.uploadService.uploadImage(fd, 'user').subscribe(
      //   (res: any) => {
      //     this.profileForm.get('profile_photo_name').patchValue(res.data.filename);
      //   },
      //   (res: any) => {
      //     this.snackbar.openSnackBar('Profile image upload failed. Please try again', '', 'warn');
      //   }
      // );

      this.uploadService.uploadImage(fd, 'user').subscribe((event: HttpEvent<any>) => {
        
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressProfileImg = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:

          // check for validation
          if(event.body.data.fileValidationError){
            this.formCustomvalidation.profileImage.validated = false;
            this.formCustomvalidation.profileImage.message = event.body.data.fileValidationError;
          }
          else{
            this.profileForm.get('profile_photo_name').patchValue(event.body.data.filename);
          }
          // hide progress bar
          setTimeout(() => {
            this.progressProfileImg = 0;
          }, 1500);
        }

      });

    }
  }

  onCoverImageChange(event) {
    // reset validation
    this.formCustomvalidation.coverImage.validated = true;
    this.formCustomvalidation.coverImage.message = '';

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.coverImage.validated = false;
        this.formCustomvalidation.coverImage.message = res.message;
        return;
      }
      
      this.coverImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("resize", 'yes');

      this.uploadService.uploadImage(fd, 'user').subscribe((event: HttpEvent<any>) => {
        
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressCoverImg = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:

          // check for validation
          if(event.body.data.fileValidationError){
            this.formCustomvalidation.coverImage.validated = false;
            this.formCustomvalidation.coverImage.message = event.body.data.fileValidationError;
          }
          else{
            this.profileForm.get('cover_photo_name').patchValue(event.body.data.filename);
          }

          // hide progress bar
          setTimeout(() => {
            this.progressCoverImg = 0;
          }, 1500);
        }

      });
   
    }
  }

  onCandidateCVChange(event) {
    // reset validation
    this.formCustomvalidation.candidateCV.validated = true;
    this.formCustomvalidation.candidateCV.message = '';

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.fileValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.candidateCV.validated = false;
        this.formCustomvalidation.candidateCV.message = res.message;
        return;
      }
      
      // send image to the server
      const fd = new FormData();
      fd.append("file", file, file.name);

      this.uploadService.uploadFile(fd, 'user').subscribe(
        
        (event: HttpEvent<any>) => {
         
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progressCandidateCV = Math.round(event.loaded / event.total * 100);
              break;
            case HttpEventType.Response:

            // check for validation
            if(event.body.data.fileValidationError){
              this.formCustomvalidation.candidateCV.validated = false;
              this.formCustomvalidation.candidateCV.message = event.body.data.fileValidationError;
            }
            else{
              this.profileForm.get('candidate_cv_name').patchValue(event.body.data.filename);
            }
            
            // hide progress bar
            setTimeout(() => {
              this.progressCandidateCV = 0;
            }, 1500);
          }

      },
      (res: any) => {
        console.log(res);
      }
      );
   
    }
  }

  /**
   * ======================================
   * candidate education
   * ======================================
   */
   // add candidate education TODO: make user_id dynamic
   addCandidateEducation(formData?: any, isEdit?: boolean, index?: number) {
     if(isEdit) {
      const eduGroup =  this.candidateEducations.at(index) as FormGroup;
      eduGroup.get('id').patchValue(formData.id);
      eduGroup.get('user_id').patchValue(this.helperservice.currentUserInfo.id);
      eduGroup.get('title').patchValue(formData.title);
      eduGroup.get('institute').patchValue(formData.institute);
      eduGroup.get('year').patchValue(formData.year);
      eduGroup.get('description').patchValue(formData.description);
     }
     else{
      const variationGroup = new FormGroup({
        id: new FormControl(formData.id || ''),
        user_id: new FormControl(this.helperservice.currentUserInfo.id || 0),  
        title: new FormControl(formData.title || ''),
        institute: new FormControl(formData.institute || ''),
        year: new FormControl(formData.year || ''),
        description: new FormControl(formData.description || ''),
      });
      this.candidateEducations.push(variationGroup);
     }
    
  }

  // remove candidate education from Form Array
  removeCandidateEducation(index: number, education?: any) {
    this.candidateEducations.removeAt(index); 
    this.removedEducations.push(education);
    
    this.profileForm.get('removedEducations').patchValue(JSON.stringify(this.removedEducations));
  }

  // update candidate educations order
  dropCandidateEducation(event: CdkDragDrop<string[]>) {
    this.helperservice.moveItemInFormArray(this.candidateEducations, event.previousIndex, event.currentIndex);
  }

  openEducationModal(education?: any, index?: number): void {
    this.dialogRefEdu = this.dialog.open(CandidateEducationModal, {
      width: '500px',
      data: { education, edit: !!education }
    });

    this.dialogRefEdu.afterClosed().subscribe((result) => {
      if(result) this.addCandidateEducation(result, !!education, index);
    });

    this.subscriptions.add(this.dialogRefEdu);

  }


  /**
   * ======================================
   * candidate experience
   * ======================================
   */
  // add candidate experience TODO: make user_id dynamic
  addCandidateExperience(formData?: any, isEdit?: boolean, index?: number) {
    if(isEdit) {
     const expGroup =  this.candidateExperiences.at(index) as FormGroup;
     expGroup.get('id').patchValue(formData.id);
     expGroup.get('user_id').patchValue(this.helperservice.currentUserInfo.id);
     expGroup.get('title').patchValue(formData.title);
     expGroup.get('start_date').patchValue(formData.start_date);
     expGroup.get('end_date').patchValue(formData.end_date);
     expGroup.get('present').patchValue(formData.present);
     expGroup.get('company').patchValue(formData.company);
     expGroup.get('description').patchValue(formData.description);
    }
    else{
     const variationGroup = new FormGroup({
       id: new FormControl(formData.id || ''),
       user_id: new FormControl(this.helperservice.currentUserInfo.id || 0),  
       title: new FormControl(formData.title || ''),
       start_date: new FormControl(formData.start_date || ''),
       end_date: new FormControl(formData.end_date || ''),
       present: new FormControl(formData.present || ''),
       company: new FormControl(formData.company || ''),
       description: new FormControl(formData.description || ''),
     });
     this.candidateExperiences.push(variationGroup);
    }
   
 }

  // remove candidate education from Form Array
  removeCandidateExperience(index: number, experience?: any) {
    this.candidateExperiences.removeAt(index); 
    this.removedExperiences.push(experience);

    this.profileForm.get('removedExperiences').patchValue(JSON.stringify(this.removedExperiences));
  }

  // update candidate educations order
  dropCandidateExperience(event: CdkDragDrop<string[]>) {
    this.helperservice.moveItemInFormArray(this.candidateExperiences, event.previousIndex, event.currentIndex);
  }

  openExperienceModal(experience?: any, index?: number): void {
    this.dialogRefExp = this.dialog.open(CandidateExperienceModal, {
      width: '500px',
      data: { experience, edit: !!experience }
    });

    this.dialogRefExp.afterClosed().subscribe((result) => {
      if(result) this.addCandidateExperience(result, !!experience, index);
    });

    this.subscriptions.add(this.dialogRefExp);

  }


  /**
   * ======================================
   * candidate portfolio
   * ======================================
   */
  // add candidate experience TODO: make user_id dynamic
  addCandidatePortfolio(formData?: any, isEdit?: boolean, index?: number) {
    if(isEdit) {
     const expGroup =  this.candidatePortfolios.at(index) as FormGroup;
     expGroup.get('id').patchValue(formData.id);
     expGroup.get('user_id').patchValue(this.helperservice.currentUserInfo.id);
     expGroup.get('title').patchValue(formData.title);
     expGroup.get('image').patchValue('');
     expGroup.get('image_name').patchValue(formData.image_name);
     expGroup.get('image_src').patchValue(formData.image_src);
     expGroup.get('youtube_url').patchValue(formData.youtube_url);
     expGroup.get('site_url').patchValue(formData.site_url);
    }
    else{
     const variationGroup = new FormGroup({
       id: new FormControl(formData.id || ''),
       user_id: new FormControl(this.helperservice.currentUserInfo.id),  
       title: new FormControl(formData.title || ''),
       image: new FormControl(formData.image || ''),
       image_name: new FormControl(formData.image_name || ''),
       image_src: new FormControl(formData.image_src || ''),
       youtube_url: new FormControl(formData.youtube_url || ''),
       site_url: new FormControl(formData.site_url || '')
     });
     this.candidatePortfolios.push(variationGroup);
    }
   
 }

  // remove candidate education from Form Array
  removeCandidatePortfolio(index: number, experience?: any) {
    this.candidatePortfolios.removeAt(index); 
    this.removedPortfolios.push(experience);

    this.profileForm.get('removedPortfolios').patchValue(JSON.stringify(this.removedPortfolios));
  }

  // update candidate educations order
  dropCandidatePortfolio(event: CdkDragDrop<string[]>) {
    this.helperservice.moveItemInFormArray(this.candidatePortfolios, event.previousIndex, event.currentIndex);
  }

  openPortfolioModal(portfolio?: any, index?: number): void {
    this.dialogRefPort = this.dialog.open(CandidatePortfolioModal, {
      width: '500px',
      data: { portfolio, edit: !!portfolio }
    });

    this.dialogRefPort.afterClosed().subscribe((result) => {
      console.log(result);
      if(result) this.addCandidatePortfolio(result, !!portfolio, index);
    });

    this.subscriptions.add(this.dialogRefPort);

  }



  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}



