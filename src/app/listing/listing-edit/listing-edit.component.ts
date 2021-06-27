import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { ListingService } from '../listing.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-listing-edit',
  templateUrl: './listing-edit.component.html',
  styleUrls: ['./listing-edit.component.scss']
})

export class ListingEditComponent implements OnInit {

  categories = [
    { value: 1, viewValue: 'Academies'},
    { value: 2, viewValue: 'Accommodation'},
    { value: 3, viewValue: 'Animation'},
    { value: 4, viewValue: 'Baby Clothing'},
    { value: 5, viewValue: 'Business Centres'},
    { value: 6, viewValue: 'Cake Makers'},
  ];
  prices = [
    { value: 'nottosay', viewValue: 'Not to say'},
    { value: 'cheap', viewValue: 'Cheap'},
    { value: 'moderate', viewValue: 'Moderate'},
    { value: 'expensive', viewValue: 'Expensive'},
    { value: 'ultra_high', viewValue: 'Ultra High'}
  ];
  products = [
    { value: 1, viewValue: 'Product 1'},
    { value: 2, viewValue: 'Product 2'},
    { value: 3, viewValue: 'Product 3'},
    { value: 4, viewValue: 'Product 4'},
    { value: 5, viewValue: 'Product 5'},
    { value: 6, viewValue: 'Product 6'},
  ];
  buttonIcons = [
    { value: 'square', viewValue: 'Square', icon: 'minus-square'},
    { value: 'envelope', viewValue: 'Envelope', icon: 'envelope'},
    { value: 'phone', viewValue: 'Phone', icon: 'phone'},
    { value: 'home', viewValue: 'Home', icon: 'home'},
    { value: 'hotel', viewValue: 'Hotel', icon: 'hotel'},
    { value: 'link', viewValue: 'Link', icon: 'link'},
    { value: 'marker', viewValue: 'Marker', icon: 'map-marker'},
    { value: 'map-pin', viewValue: 'Map Pin', icon: 'map-pin'},
    { value: 'cutlery', viewValue: 'Cutlery', icon: 'cutlery'},
    { value: 'cart', viewValue: 'Cart', icon: 'shopping-cart'},
    { value: 'check-circle', viewValue: 'Check Circle', icon: 'check-circle-o'}
  ];
  hours = [
    { value: '24hrs', viewValue: '24 hours'},
    { value: '00:00', viewValue: '00:00'},
    { value: '00:15', viewValue: '00:15'},
    { value: '00:30', viewValue: '00:30'},
    { value: '00:45', viewValue: '00:45'},
    { value: '01:00', viewValue: '01:00'},
    { value: '01:15', viewValue: '01:15'},
    { value: '01:30', viewValue: '01:30'},
    { value: '01:45', viewValue: '01:45'},
    { value: '02:00', viewValue: '02:00'},
    { value: '02:15', viewValue: '02:15'},
    { value: '02:30', viewValue: '02:30'},
    { value: '02:45', viewValue: '02:45'},
    { value: '03:00', viewValue: '03:00'},
    { value: '03:15', viewValue: '03:15'},
    { value: '03:30', viewValue: '03:30'},
    { value: '03:45', viewValue: '03:45'},
    { value: '04:00', viewValue: '04:00'},
    { value: '04:15', viewValue: '04:15'},
    { value: '04:30', viewValue: '04:30'},
    { value: '04:45', viewValue: '04:45'},
    { value: '05:00', viewValue: '05:00'},
    { value: '05:15', viewValue: '05:15'},
    { value: '05:30', viewValue: '05:30'},
    { value: '05:45', viewValue: '05:45'},
    { value: '06:00', viewValue: '06:00'},
    { value: '06:15', viewValue: '06:15'},
    { value: '06:30', viewValue: '06:30'},
    { value: '06:45', viewValue: '06:45'},
    { value: '07:00', viewValue: '07:00'},
    { value: '07:15', viewValue: '07:15'},
    { value: '07:30', viewValue: '07:30'},
    { value: '07:45', viewValue: '07:45'},
    { value: '08:00', viewValue: '08:00'},
    { value: '08:15', viewValue: '08:15'},
    { value: '08:30', viewValue: '08:30'},
    { value: '08:45', viewValue: '08:45'},
    { value: '09:00', viewValue: '09:00'},
    { value: '09:15', viewValue: '09:15'},
    { value: '09:30', viewValue: '09:30'},
    { value: '09:45', viewValue: '09:45'},
    { value: '10:00', viewValue: '10:00'},
    { value: '10:15', viewValue: '10:15'},
    { value: '10:30', viewValue: '10:30'},
    { value: '10:45', viewValue: '10:45'},
    { value: '11:00', viewValue: '11:00'},
    { value: '11:15', viewValue: '11:15'},
    { value: '11:30', viewValue: '11:30'},
    { value: '11:45', viewValue: '11:45'},
    { value: '12:00', viewValue: '12:00'},
    { value: '12:15', viewValue: '12:15'},
    { value: '12:30', viewValue: '12:30'},
    { value: '12:45', viewValue: '12:45'},
    { value: '13:00', viewValue: '13:00'},
    { value: '13:15', viewValue: '13:15'},
    { value: '13:30', viewValue: '13:30'},
    { value: '13:45', viewValue: '13:45'},
    { value: '14:00', viewValue: '14:00'},
    { value: '14:15', viewValue: '14:15'},
    { value: '14:30', viewValue: '14:30'},
    { value: '14:45', viewValue: '14:45'},
    { value: '15:00', viewValue: '15:00'},
    { value: '15:15', viewValue: '15:15'},
    { value: '15:30', viewValue: '15:30'},
    { value: '15:45', viewValue: '15:45'},
    { value: '16:00', viewValue: '16:00'},
    { value: '16:15', viewValue: '16:15'},
    { value: '16:30', viewValue: '16:30'},
    { value: '16:45', viewValue: '16:45'},
    { value: '17:00', viewValue: '17:00'},
    { value: '17:15', viewValue: '17:15'},
    { value: '17:30', viewValue: '17:30'},
    { value: '17:45', viewValue: '17:45'},
    { value: '18:00', viewValue: '18:00'},
    { value: '18:15', viewValue: '18:15'},
    { value: '18:30', viewValue: '18:30'},
    { value: '18:45', viewValue: '18:45'},
    { value: '19:00', viewValue: '19:00'},
    { value: '19:15', viewValue: '19:15'},
    { value: '19:30', viewValue: '19:30'},
    { value: '19:45', viewValue: '19:45'},
    { value: '20:00', viewValue: '20:00'},
    { value: '20:15', viewValue: '20:15'},
    { value: '20:30', viewValue: '20:30'},
    { value: '20:45', viewValue: '20:45'},
    { value: '21:00', viewValue: '21:00'},
    { value: '21:15', viewValue: '21:15'},
    { value: '21:30', viewValue: '21:30'},
    { value: '21:45', viewValue: '21:45'},
    { value: '22:00', viewValue: '22:00'},
    { value: '22:15', viewValue: '22:15'},
    { value: '22:30', viewValue: '22:30'},
    { value: '22:45', viewValue: '22:45'},
    { value: '23:00', viewValue: '23:00'},
    { value: '23:15', viewValue: '23:15'},
    { value: '23:30', viewValue: '23:30'},
    { value: '23:45', viewValue: '23:45'},
  ];


  subscriptions: Subscription = new Subscription();

  listing_slug:string;
  listing:any;
  listingForm: FormGroup;
  showError = false;
  errorMessage:string[];
  formCustomvalidation = {
    logo: {
      validated: true,
      message: ''
    },
    coverImage: {
      validated: true,
      message: ''
    },
    featuredImage: {
      validated: true,
      message: ''
    },
    couponImage: {
      validated: true,
      message: ''
    },
    menuImage: {},
    galleryImage: {}
  };
  submitted:boolean = false;
  logoImageSrc: string;
  progressLogo:number = 0;
  coverImageSrc: string;
  progressCoverImg:number = 0;
  featuredImageSrc: string;
  progressFeaturedImg:number = 0;
  couponImageSrc: string;
  progressCouponImg:number = 0;
  videoURLs: FormArray;
  selectedBushinessHour: string;

  galleryImages = {}
  progressGalleryImages = {}
  menuItemImages = {}
  progressMenuImages = {}
  
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private listingService: ListingService,
    private helperservice: HelperService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
    private uploadService: UploadService
  ) { }


   // convenience getter for easy access to form fields
   get f() { return this.listingForm.controls; }

  ngOnInit() {

    this.listing_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    
    // check user authentication first
    this.userService.checkAuthentication();

    // initialise form data
    this.setupFormData();
    
    // retrieve the listing
    this.spinnerService.show();

    const subscriptionGetlisting = this.listingService.getListing(this.listing_slug).subscribe(
      (res:any) => {
        
        this.listing = res.data;
        
        // redirect to home page if listing user_id OR claimer_id not equal to current user id
        if(this.helperservice.currentUserInfo.id != this.listing.listing.user_id || 
          this.helperservice.currentUserInfo.id != this.listing.listing.claimer_id){
            this.router.navigate(['home']);
        }
        
        this.populateFormData();
        this.spinnerService.hide();

      },
      (res:any) => {
        this.spinnerService.hide();
        // TODO: redirect to 404 page

      }
    );

    this.subscriptions.add(subscriptionGetlisting);


  }

  populateFormData() {
    const listing = this.listing.listing;
    console.log(this.listing);

    this.listingForm.patchValue({
      title: listing.title,
      tagline: listing.tagline,
    });

  }

  setupFormData() {
    this.listingForm = new FormGroup({
      title: new FormControl('', Validators.required),
      tagline: new FormControl(''),
      logo_input: new FormControl('', Validators.required),
      logo: new FormControl('', Validators.required),
      cover_img_input: new FormControl('', Validators.required),
      cover_img: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lng: new FormControl('', Validators.required),
      categories: new FormControl('', Validators.required),
      products: new FormControl(''),

      price_range: new FormControl(''),
      price_min: new FormControl(null),
      price_max: new FormControl(null),

      featured_img_input: new FormControl('', Validators.required),
      featured_img: new FormControl('', Validators.required),

      galleries: new FormArray([
        new FormGroup({
          image_input: new FormControl(''),
          image: new FormControl('')
        })
      ]),

      business_hour: new FormControl(''),
      button_icon: new FormControl(''),
      button_link: new FormControl(''),
      button_name: new FormControl(''),

      email: new FormControl(''),
      phone: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      tiktok: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl(''),

      coupon_title: new FormControl(''),
      coupon_description: new FormControl(''),
      coupon_image_input: new FormControl(''),
      coupon_image: new FormControl(''),
      coupon_code: new FormControl(''),
      coupon_popup_desc: new FormControl(''),
      coupon_link: new FormControl(''),
      coupon_expiry_date: new FormControl(''),

      video_urls: new FormArray([
        new FormControl('')
      ]),

      restaurants: new FormArray([]),

      businsessHourSunday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null)
          })
        ])
      }),
      businsessHourMonday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null)
          })
        ])
      }),
      businsessHourTuesday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null)
          })
        ])
      }),
      businsessHourWednesday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null)
          })
        ])
      }),
      businsessHourThursday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null)
          })
        ])
      }),
      businsessHourFriday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null)
          })
        ])
      }),
      businsessHourSaturday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null)
          })
        ])
      }),
      
      
    });
  }

  onSubmit() {
    this.submitted = true;

    // empty existing error messages
    this.emptyErrorMsg();

    if(this.listingForm.invalid) return;

    const formData = this.listingForm.value;
  
    // remove timezone from date, using moment
    formData.coupon_expiry_date = moment(formData.coupon_expiry_date).format("YYYY-MM-DD HH:mm:ss");
    
    // console.log(JSON.stringify(formData));
    // return;
    this.spinnerService.show();
    const subscriptionAddlisting = this.listingService.addListing(formData).subscribe(
      (res:any) => {
        console.log(res);
        this.spinnerService.hide();

        // redirect to listing details page
        this.router.navigate([`listing/${res.data.slug}`]);
      },
      (res:any) => {
        if(res.status == 401){
          this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
        }

        if(res.error.errors){
          for (const iterator of res.error.errors) {
              this.errorMessage.push(iterator.msg);
          }
        }
        else{
            this.errorMessage.push(res.error.message);
        }
        
        this.showError = true;
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subscriptionAddlisting);

  }

  emptyErrorMsg() {
    this.showError = false;
    this.errorMessage = [];
  }

  // add times to business hours
  addGalleryImage() {
    const variationGroup = new FormGroup({
      image_input: new FormControl(''),
      image: new FormControl('')
    });
    (this.listingForm.get('galleries') as FormArray).push(variationGroup);
  }

  // remove times from business hours
  removeGalleryImage(Index: number) {
    (this.listingForm.get('galleries') as FormArray).removeAt(Index);
  }

  // change business hour radio, set selectedBushinessHour
  changeBusinessHour(event: MatRadioChange){
    this.selectedBushinessHour = event.value;
  }

  // business hour slide toggle change
  businessHourSlideToggle($event: MatSlideToggleChange, business_hour: string) {
    if(!$event.checked){
      const times =  (this.listingForm.get(business_hour).get('times') as FormArray);
      times.clear();
      const variationGroup = new FormGroup({
        open: new FormControl(''),
        closes: new FormControl('')
      });
      times.push(variationGroup);
    }
  }

  // add times to business hours
  addTimeOpenClose(businessHour: string) {
    const times =  this.listingForm.get(businessHour).get('times') as FormArray;
    const variationGroup = new FormGroup({
      open: new FormControl(null),
      closes: new FormControl(null)
    });
    times.push(variationGroup);
  }

  // remove times from business hours
  removeTimeOpenClose(businessHour: string, Index: number) {
    (this.listingForm.get(businessHour).get('times') as FormArray ).removeAt(Index);
  }

  // add fields to restaurants items FormArray
  addRestaurantMenuItem(index: number) {
    const resGroup =  (this.listingForm.get('restaurants') as FormArray ).at(index) as FormGroup;
    const variationGroup = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      image_input: new FormControl(''),
      image: new FormControl(''),
      price: new FormControl(null),
      link: new FormControl(''),
      is_new_window: new FormControl('')
    });
    (resGroup.get('items') as FormArray ).push(variationGroup);
  }

  // remove fields from restaurants items FormArray
  removeRestaurantMenuItem(resIndex: number, itemIndex: number) {
    const resGroup =  (this.listingForm.get('restaurants') as FormArray ).at(resIndex) as FormGroup;
    (resGroup.get('items') as FormArray ).removeAt(itemIndex); 
  }

  // add fields to restaurants FormArray
  addRestaurantMenu() {
    const variationGroup = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      icon: new FormControl(''),
      items: new FormArray([
        new FormGroup({
          title: new FormControl(''),
          description: new FormControl(''),
          image_input: new FormControl(''),
          image: new FormControl(''),
          price: new FormControl(''),
          link: new FormControl(''),
          is_new_window: new FormControl('')
        })
      ])
    });
    (this.listingForm.get('restaurants') as FormArray ).push(variationGroup);
  }

  // remove fields from restaurants FormArray
  removeRestaurantMenu(index: number) {
    (this.listingForm.get('restaurants') as FormArray ).removeAt(index); 
  }

  onMenuItemImageChange(event, imageSrc:string, menuNumber:any, itemNumber:any) {
    
    // reset validation
    this.formCustomvalidation.menuImage[imageSrc] = false;

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.menuImage[imageSrc] = true;
        return;
      }
      
      this.menuItemImages[imageSrc] = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("resize", 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressMenuImages[imageSrc] = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:

          // check for validation
          if(event.body.data.fileValidationError){
            this.formCustomvalidation.menuImage[imageSrc] = true;
          }
          else{
            const menuGroup = (this.listingForm.get('restaurants') as FormArray).at(menuNumber) as FormGroup;
            ((menuGroup.get('items') as FormArray).at(itemNumber) as FormGroup).get('image').patchValue(event.body.data.filename);
          }

          // hide progress bar
          setTimeout(() => {
            this.progressMenuImages[imageSrc] = 0;
          }, 1000);
        }

      });
   
    }


  }

  // remove url field from video_urls FormArray
  removeVideoURLs(index: number) {
    (this.listingForm.get('video_urls') as FormArray ).removeAt(index); 
  }

  // add url field to video_urls FormArray
  addVideoURLs() {
    (this.listingForm.get('video_urls') as FormArray ).push( new FormControl('') );
  }

  onLogoImageChange(event) {

    // reset validation
    this.formCustomvalidation.logo.validated = true;

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.logo.validated = false;
        this.formCustomvalidation.logo.message = res.message;
        return;
      }
      
      this.logoImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("resize", 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressLogo = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:

          // check for validation
          if(event.body.data.fileValidationError){
            this.formCustomvalidation.logo.validated = false;
            this.formCustomvalidation.logo.message = event.body.data.fileValidationError;
          }
          else{
            this.listingForm.get('logo').patchValue(event.body.data.filename);
          }

          // hide progress bar
          setTimeout(() => {
            this.progressLogo = 0;
          }, 1000);
        }

      });
   
    }


  }

  onCoverImageChange(event) {

    // reset validation
    this.formCustomvalidation.coverImage.validated = true;

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

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        
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
            this.listingForm.get('cover_img').patchValue(event.body.data.filename);
          }

          // hide progress bar
          setTimeout(() => {
            this.progressCoverImg = 0;
          }, 1000);
        }

      });
   
    }

  }

  onFeaturedImageChange(event) {

    this.formCustomvalidation.featuredImage.validated = true;

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.featuredImage.validated = false;
        this.formCustomvalidation.featuredImage.message = res.message;
        return;
      }
      
      this.featuredImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("resize", 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressFeaturedImg = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:

          // check for validation
          if(event.body.data.fileValidationError){
            this.formCustomvalidation.featuredImage.validated = false;
            this.formCustomvalidation.featuredImage.message = event.body.data.fileValidationError;
          }
          else{
            this.listingForm.get('featured_img').patchValue(event.body.data.filename);
          }

          // hide progress bar
          setTimeout(() => {
            this.progressFeaturedImg = 0;
          }, 1000);
        }

      });
   
    }

  }
  
  onCouponImageChange(event) {

    this.formCustomvalidation.couponImage.validated = true;

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.couponImage.validated = false;
        this.formCustomvalidation.couponImage.message = res.message;
        return;
      }
      
      this.couponImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("resize", 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressCouponImg = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:

          // check for validation
          if(event.body.data.fileValidationError){
            this.formCustomvalidation.couponImage.validated = false;
            this.formCustomvalidation.couponImage.message = event.body.data.fileValidationError;
          }
          else{
            this.listingForm.get('coupon_image').patchValue(event.body.data.filename);
          }

          // hide progress bar
          setTimeout(() => {
            this.progressCouponImg = 0;
          }, 1000);
        }

      });
   
    }
  }

  onGalleryImageChange(event, imageSrc) {
    
    // reset validation
    this.formCustomvalidation.galleryImage[imageSrc] = false;

    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if(!res.validated) {
        this.formCustomvalidation.galleryImage[imageSrc] = true;
        return;
      }
      
      this.galleryImages[imageSrc] = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("resize", 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressGalleryImages[imageSrc] = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:

          // check for validation
          if(event.body.data.fileValidationError){
            this.formCustomvalidation.galleryImage[imageSrc] = true;
          }
          else{
            const galleryGroup = (this.listingForm.get('galleries') as FormArray).at(imageSrc) as FormGroup;
            galleryGroup.get('image').patchValue(event.body.data.filename);
          }

          // hide progress bar
          setTimeout(() => {
            this.progressGalleryImages[imageSrc] = 0;
          }, 1000);
        }

      });
   
    }


  }

  onSelectOpen(opened: boolean, searchInput: any) {
    if (opened) {
      searchInput.focus();
    }
  }

  filteredListingCategory(searchString: any) {
    if (this.categories) {
      return this.categories.filter((category) => category.viewValue.toLowerCase().includes(searchString.toLowerCase()));
    }

    return [];
  }

  filteredListingProducts(searchString: any) {
    if (this.products) {
      return this.products.filter((product) => product.viewValue.toLowerCase().includes(searchString.toLowerCase()));
    }

    return [];
  }

  scrollToSection(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}

