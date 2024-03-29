import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { ListingService } from '../listing.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import * as moment from 'moment';
import { MatSelect } from '@angular/material/select';
import { MatOptionSelectionChange } from '@angular/material/core';

declare const google: any;

@Component({
  selector: 'app-listing-new',
  templateUrl: './listing-new.component.html',
  styleUrls: ['./listing-new.component.scss'],
})
export class ListingNewComponent implements OnInit, AfterViewInit {
  @ViewChild('categorySelect') categorySelect: MatSelect;

  locationModified = false;
  selectedCategories = [];
  categories = [];
  users = [];
  prices = [
    { value: 'nottosay', viewValue: 'Not to say' },
    { value: 'cheap', viewValue: 'Cheap' },
    { value: 'moderate', viewValue: 'Moderate' },
    { value: 'expensive', viewValue: 'Expensive' },
    { value: 'ultra_high', viewValue: 'Ultra High' },
  ];
  products = [];
  buttonIcons = [
    { value: 'envelope', viewValue: 'Envelope', icon: 'envelope' },
    { value: 'phone', viewValue: 'Phone', icon: 'phone' },
    { value: 'home', viewValue: 'Home', icon: 'home' },
    { value: 'hotel', viewValue: 'Hotel', icon: 'hotel' },
    { value: 'link', viewValue: 'Link', icon: 'link' },
    { value: 'marker', viewValue: 'Marker', icon: 'map-marker' },
    { value: 'map-pin', viewValue: 'Map Pin', icon: 'map-pin' },
    { value: 'cutlery', viewValue: 'Cutlery', icon: 'cutlery' },
    { value: 'cart', viewValue: 'Cart', icon: 'shopping-cart' },
    { value: 'check-circle', viewValue: 'Check Circle', icon: 'check-circle-o' },
  ];
  hours = [
    { value: '24hrs', viewValue: '24 hours' },
    { value: '00:00', viewValue: '00:00' },
    { value: '00:15', viewValue: '00:15' },
    { value: '00:30', viewValue: '00:30' },
    { value: '00:45', viewValue: '00:45' },
    { value: '01:00', viewValue: '01:00' },
    { value: '01:15', viewValue: '01:15' },
    { value: '01:30', viewValue: '01:30' },
    { value: '01:45', viewValue: '01:45' },
    { value: '02:00', viewValue: '02:00' },
    { value: '02:15', viewValue: '02:15' },
    { value: '02:30', viewValue: '02:30' },
    { value: '02:45', viewValue: '02:45' },
    { value: '03:00', viewValue: '03:00' },
    { value: '03:15', viewValue: '03:15' },
    { value: '03:30', viewValue: '03:30' },
    { value: '03:45', viewValue: '03:45' },
    { value: '04:00', viewValue: '04:00' },
    { value: '04:15', viewValue: '04:15' },
    { value: '04:30', viewValue: '04:30' },
    { value: '04:45', viewValue: '04:45' },
    { value: '05:00', viewValue: '05:00' },
    { value: '05:15', viewValue: '05:15' },
    { value: '05:30', viewValue: '05:30' },
    { value: '05:45', viewValue: '05:45' },
    { value: '06:00', viewValue: '06:00' },
    { value: '06:15', viewValue: '06:15' },
    { value: '06:30', viewValue: '06:30' },
    { value: '06:45', viewValue: '06:45' },
    { value: '07:00', viewValue: '07:00' },
    { value: '07:15', viewValue: '07:15' },
    { value: '07:30', viewValue: '07:30' },
    { value: '07:45', viewValue: '07:45' },
    { value: '08:00', viewValue: '08:00' },
    { value: '08:15', viewValue: '08:15' },
    { value: '08:30', viewValue: '08:30' },
    { value: '08:45', viewValue: '08:45' },
    { value: '09:00', viewValue: '09:00' },
    { value: '09:15', viewValue: '09:15' },
    { value: '09:30', viewValue: '09:30' },
    { value: '09:45', viewValue: '09:45' },
    { value: '10:00', viewValue: '10:00' },
    { value: '10:15', viewValue: '10:15' },
    { value: '10:30', viewValue: '10:30' },
    { value: '10:45', viewValue: '10:45' },
    { value: '11:00', viewValue: '11:00' },
    { value: '11:15', viewValue: '11:15' },
    { value: '11:30', viewValue: '11:30' },
    { value: '11:45', viewValue: '11:45' },
    { value: '12:00', viewValue: '12:00' },
    { value: '12:15', viewValue: '12:15' },
    { value: '12:30', viewValue: '12:30' },
    { value: '12:45', viewValue: '12:45' },
    { value: '13:00', viewValue: '13:00' },
    { value: '13:15', viewValue: '13:15' },
    { value: '13:30', viewValue: '13:30' },
    { value: '13:45', viewValue: '13:45' },
    { value: '14:00', viewValue: '14:00' },
    { value: '14:15', viewValue: '14:15' },
    { value: '14:30', viewValue: '14:30' },
    { value: '14:45', viewValue: '14:45' },
    { value: '15:00', viewValue: '15:00' },
    { value: '15:15', viewValue: '15:15' },
    { value: '15:30', viewValue: '15:30' },
    { value: '15:45', viewValue: '15:45' },
    { value: '16:00', viewValue: '16:00' },
    { value: '16:15', viewValue: '16:15' },
    { value: '16:30', viewValue: '16:30' },
    { value: '16:45', viewValue: '16:45' },
    { value: '17:00', viewValue: '17:00' },
    { value: '17:15', viewValue: '17:15' },
    { value: '17:30', viewValue: '17:30' },
    { value: '17:45', viewValue: '17:45' },
    { value: '18:00', viewValue: '18:00' },
    { value: '18:15', viewValue: '18:15' },
    { value: '18:30', viewValue: '18:30' },
    { value: '18:45', viewValue: '18:45' },
    { value: '19:00', viewValue: '19:00' },
    { value: '19:15', viewValue: '19:15' },
    { value: '19:30', viewValue: '19:30' },
    { value: '19:45', viewValue: '19:45' },
    { value: '20:00', viewValue: '20:00' },
    { value: '20:15', viewValue: '20:15' },
    { value: '20:30', viewValue: '20:30' },
    { value: '20:45', viewValue: '20:45' },
    { value: '21:00', viewValue: '21:00' },
    { value: '21:15', viewValue: '21:15' },
    { value: '21:30', viewValue: '21:30' },
    { value: '21:45', viewValue: '21:45' },
    { value: '22:00', viewValue: '22:00' },
    { value: '22:15', viewValue: '22:15' },
    { value: '22:30', viewValue: '22:30' },
    { value: '22:45', viewValue: '22:45' },
    { value: '23:00', viewValue: '23:00' },
    { value: '23:15', viewValue: '23:15' },
    { value: '23:30', viewValue: '23:30' },
    { value: '23:45', viewValue: '23:45' },
  ];

  ckEditor = DocumentEditor;
  ckConfig = {
    placeholder: 'Description',
    height: 200,
    toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList'],
  };

  subscriptions: Subscription = new Subscription();

  listingForm: FormGroup;
  showError = false;
  errorMessage: string[];
  formCustomvalidation = {
    logo: {
      validated: true,
      message: '',
    },
    coverImage: {
      validated: true,
      message: '',
    },
    featuredImage: {
      validated: true,
      message: '',
    },
    couponImage: {
      validated: true,
      message: '',
    },
    menuImage: {},
    galleryImage: {},
  };
  submitted: boolean = false;
  logoImageSrc: string;
  progressLogo: number = 0;
  coverImageSrc: string;
  progressCoverImg: number = 0;
  featuredImageSrc: string;
  progressFeaturedImg: number = 0;
  couponImageSrc: string;
  progressCouponImg: number = 0;
  videoURLs: FormArray;
  selectedBushinessHour: string;

  galleryImages = {};
  progressGalleryImages = {};
  menuItemImages = {};
  progressMenuImages = {};

  map: any;
  mapMarker: any;

  constructor(
    public dialog: MatDialog,
    private listingService: ListingService,
    private helperservice: HelperService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
    private uploadService: UploadService,
    private cdk: ChangeDetectorRef
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.listingForm.controls;
  }

  ngOnInit() {
    // check user authentication first
    this.userService.checkAuthentication();

    this.setupListingForm();
  }

  ngAfterViewInit() {
    this.categorySelect.optionSelectionChanges.subscribe((option: MatOptionSelectionChange) => {
      if (!option.isUserInput) {
        return;
      }

      if (option.source.selected) {
        this.selectedCategories.push(option.source.value);
      } else {
        this.selectedCategories = this.selectedCategories.filter((item) => item !== option.source.value);
      }
    });
  }

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
  }

  setupListingForm() {
    this.listingForm = new FormGroup({
      title: new FormControl('', Validators.required),
      tagline: new FormControl(''),
      logo_input: new FormControl(''),
      logo: new FormControl(''),
      cover_img_input: new FormControl(''),
      cover_img: new FormControl(''),
      description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lng: new FormControl('', Validators.required),
      categories: new FormControl('', Validators.required),
      claimer_id: new FormControl(''),
      products: new FormControl(''),

      price_range: new FormControl(''),
      price_min: new FormControl(null),
      price_max: new FormControl(null),

      featured_img_input: new FormControl(''),
      featured_img: new FormControl(''),

      galleries: new FormArray([
        new FormGroup({
          image_input: new FormControl(''),
          image: new FormControl(''),
        }),
      ]),

      business_hour: new FormControl(''),
      button_icon: new FormControl(''),
      button_link: new FormControl(''),
      button_name: new FormControl(''),

      email: new FormControl(''),
      phone: new FormControl(''),
      website: new FormControl(''),

      facebook: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl(''),
      instagram: new FormControl(''),
      pinterest: new FormControl(''),
      spotify: new FormControl(''),
      tiktok: new FormControl(''),
      youtube: new FormControl(''),
      apple_music: new FormControl(''),
      tidal: new FormControl(''),
      soundcloud: new FormControl(''),

      coupon_title: new FormControl(''),
      coupon_description: new FormControl(''),
      coupon_image_input: new FormControl(''),
      coupon_image: new FormControl(''),
      coupon_code: new FormControl(''),
      coupon_popup_desc: new FormControl(''),
      coupon_link: new FormControl(''),
      coupon_expiry_date: new FormControl(null),

      video_urls: new FormArray([new FormControl('')]),

      restaurants: new FormArray([]),

      businsessHourSunday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null),
          }),
        ]),
      }),
      businsessHourMonday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null),
          }),
        ]),
      }),
      businsessHourTuesday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null),
          }),
        ]),
      }),
      businsessHourWednesday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null),
          }),
        ]),
      }),
      businsessHourThursday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null),
          }),
        ]),
      }),
      businsessHourFriday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null),
          }),
        ]),
      }),
      businsessHourSaturday: new FormGroup({
        is_open: new FormControl(''),
        times: new FormArray([
          new FormGroup({
            open: new FormControl(null),
            closes: new FormControl(null),
          }),
        ]),
      }),

      meta_title: new FormControl(''),
      meta_keywords: new FormControl(''),
      meta_desc: new FormControl(''),
    });

    // get categories for form category dropdown
    const subsListingCategories = this.listingService.getCategories().subscribe(
      (res: any) => {
        if (res.data.length > 0) {
          for (const item of res.data) {
            const tmp = { value: item.id, viewValue: item.title };
            this.categories.push(tmp);
          }
        }
      },
      (res: any) => {}
    );
    this.subscriptions.add(subsListingCategories);

    // get users for form users dropdown
    const subsAllUsers = this.userService.getAllUsers().subscribe(
      (res: any) => {
        if (res.length > 0) {
          for (const item of res) {
            const tmp = { value: item.id, viewValue: item.email };
            this.users.push(tmp);
          }
        }
        console.log(this.users);
      },
      (res: any) => {}
    );
    this.subscriptions.add(subsAllUsers);

    // get products for form category dropdown
    const pParams = { params: { user_id: this.helperservice.currentUserInfo.id } };
    const subsListingProducts = this.listingService.getProducts(pParams).subscribe(
      (res: any) => {
        if (res.data.length > 0) {
          for (const item of res.data) {
            const tmp = { value: item.id, viewValue: item.title };
            this.products.push(tmp);
          }
        }
      },
      (res: any) => {}
    );
    this.subscriptions.add(subsListingProducts);

    this.initializeGoogleMap();
  }

  initializeGoogleMap() {
    const latitude = this.listingForm.get('lat');
    const longitude = this.listingForm.get('lng');

    const mapProp = {
      zoom: 10,
      scrollwheel: true,
      zoomControl: true,
    };

    this.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const geocoder = new google.maps.Geocoder();
    const input = document.querySelector('input[formControlName=address]') as HTMLInputElement;
    const address = this.listingForm.get('address');
    this.mapMarker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    const initialLat = 52.49840357809672;
    const initialLng = -1.4366882483060417;

    this.map.setCenter({ lat: initialLat, lng: initialLng });
    this.mapMarker.setPosition({ lat: 23, lng: 90 });

    const autocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
      origin: this.map.getCenter(),
      strictBounds: false,
    };

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      const lat = event.latLng.lat(); // lat of clicked point
      const lng = event.latLng.lng(); // lng of clicked point

      const latlng = { lat, lng };

      this.mapMarker.setPosition(latlng);

      latitude.setValue(lat);
      longitude.setValue(lng);

      geocoder.geocode(
        {
          latLng: latlng,
        },
        (results: any, status: any) => {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              address.setValue(results[0].formatted_address);
            }
          }
        }
      );
    });

    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      // infowindow.close();
      this.mapMarker.setVisible(false);
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }

      this.mapMarker.setPosition(place.geometry.location);
      this.mapMarker.setVisible(true);

      address.setValue(place.formatted_address);
      latitude.setValue(place.geometry.location.lat());
      longitude.setValue(place.geometry.location.lng());

      this.cdk.detectChanges();
    });
  }

  onSubmit() {
    this.submitted = true;

    // empty existing error messages
    this.emptyErrorMsg();

    if (this.listingForm.invalid) return;

    const formData = this.listingForm.value;
    if (formData.coupon_expiry_date == null || formData.coupon_expiry_date == 'Invalid date') {
      formData.coupon_expiry_date = null;
    } else {
      // remove timezone from date, using moment
      formData.coupon_expiry_date = moment(formData.coupon_expiry_date).utc().format('YYYY-MM-DD HH:mm:ss');
    }

    this.spinnerService.show();
    const subscriptionAddlisting = this.listingService.addListing(formData).subscribe(
      (res: any) => {
        console.log(res);
        this.spinnerService.hide();

        // redirect to listing details page
        this.router.navigate([`listing/${res.data.slug}`]);
      },
      (res: any) => {
        if (res.status == 401) {
          this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
        }

        if (res.error.errors) {
          for (const iterator of res.error.errors) {
            this.errorMessage.push(iterator.msg);
          }
        } else {
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

  // add gallery image
  addGalleryImage() {
    const variationGroup = new FormGroup({
      image_input: new FormControl(''),
      image: new FormControl(''),
    });
    (this.listingForm.get('galleries') as FormArray).push(variationGroup);
  }

  // remove gallery image
  removeGalleryImage(Index: number) {
    (this.listingForm.get('galleries') as FormArray).removeAt(Index);
  }

  // change business hour radio, set selectedBushinessHour
  changeBusinessHour(event: MatRadioChange) {
    this.selectedBushinessHour = event.value;
  }

  // business hour slide toggle change
  businessHourSlideToggle($event: MatSlideToggleChange, business_hour: string) {
    if (!$event.checked) {
      const times = this.listingForm.get(business_hour).get('times') as FormArray;
      times.clear();
      const variationGroup = new FormGroup({
        open: new FormControl(''),
        closes: new FormControl(''),
      });
      times.push(variationGroup);
    }
  }

  // add times to business hours
  addTimeOpenClose(businessHour: string) {
    const times = this.listingForm.get(businessHour).get('times') as FormArray;
    const variationGroup = new FormGroup({
      open: new FormControl(null),
      closes: new FormControl(null),
    });
    times.push(variationGroup);
  }

  // remove times from business hours
  removeTimeOpenClose(businessHour: string, Index: number) {
    (this.listingForm.get(businessHour).get('times') as FormArray).removeAt(Index);
  }

  // add fields to restaurants items FormArray
  addRestaurantMenuItem(index: number) {
    const resGroup = (this.listingForm.get('restaurants') as FormArray).at(index) as FormGroup;
    const variationGroup = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      image_input: new FormControl(''),
      image: new FormControl(''),
      price: new FormControl(null),
      link: new FormControl(''),
      is_new_window: new FormControl(''),
    });
    (resGroup.get('items') as FormArray).push(variationGroup);
  }

  // remove fields from restaurants items FormArray
  removeRestaurantMenuItem(resIndex: number, itemIndex: number) {
    const resGroup = (this.listingForm.get('restaurants') as FormArray).at(resIndex) as FormGroup;
    (resGroup.get('items') as FormArray).removeAt(itemIndex);
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
          is_new_window: new FormControl(''),
        }),
      ]),
    });
    (this.listingForm.get('restaurants') as FormArray).push(variationGroup);
  }

  // remove fields from restaurants FormArray
  removeRestaurantMenu(index: number) {
    (this.listingForm.get('restaurants') as FormArray).removeAt(index);
  }

  onMenuItemImageChange(event, imageSrc: string, menuNumber: any, itemNumber: any) {
    // reset validation
    this.formCustomvalidation.menuImage[imageSrc] = false;

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.menuImage[imageSrc] = true;
        return;
      }

      this.menuItemImages[imageSrc] = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressMenuImages[imageSrc] = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.formCustomvalidation.menuImage[imageSrc] = true;
            } else {
              const menuGroup = (this.listingForm.get('restaurants') as FormArray).at(menuNumber) as FormGroup;
              ((menuGroup.get('items') as FormArray).at(itemNumber) as FormGroup)
                .get('image')
                .patchValue(event.body.data.filename);
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
    (this.listingForm.get('video_urls') as FormArray).removeAt(index);
  }

  // add url field to video_urls FormArray
  addVideoURLs() {
    (this.listingForm.get('video_urls') as FormArray).push(new FormControl(''));
  }

  onLogoImageChange(event) {
    // reset validation
    this.formCustomvalidation.logo.validated = true;

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.logo.validated = false;
        this.formCustomvalidation.logo.message = res.message;
        return;
      }

      this.logoImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressLogo = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.formCustomvalidation.logo.validated = false;
              this.formCustomvalidation.logo.message = event.body.data.fileValidationError;
            } else {
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

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.coverImage.validated = false;
        this.formCustomvalidation.coverImage.message = res.message;
        return;
      }

      this.coverImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressCoverImg = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.formCustomvalidation.coverImage.validated = false;
              this.formCustomvalidation.coverImage.message = event.body.data.fileValidationError;
            } else {
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

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.featuredImage.validated = false;
        this.formCustomvalidation.featuredImage.message = res.message;
        return;
      }

      this.featuredImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressFeaturedImg = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.formCustomvalidation.featuredImage.validated = false;
              this.formCustomvalidation.featuredImage.message = event.body.data.fileValidationError;
            } else {
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

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.couponImage.validated = false;
        this.formCustomvalidation.couponImage.message = res.message;
        return;
      }

      this.couponImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressCouponImg = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.formCustomvalidation.couponImage.validated = false;
              this.formCustomvalidation.couponImage.message = event.body.data.fileValidationError;
            } else {
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

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperservice.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.galleryImage[imageSrc] = true;
        return;
      }

      this.galleryImages[imageSrc] = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'listing').subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressGalleryImages[imageSrc] = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.formCustomvalidation.galleryImage[imageSrc] = true;
            } else {
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
    } else {
      searchInput.value = '';
      this.listingForm.get('categories').setValue(this.selectedCategories);
    }
  }

  filteredListingCategory(searchString: any) {
    if (this.categories) {
      return this.categories.filter((category) =>
        category.viewValue.toLowerCase().includes(searchString.toLowerCase())
      );
    }

    return [];
  }

  filteredListingClaimer(searchString: any) {
    if (this.users) {
      return this.users.filter((user) => user.viewValue.toLowerCase().includes(searchString.toLowerCase()));
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

  onLocationBlur() {
    if (this.locationModified) {
      this.listingForm.patchValue({
        lat: '',
        lng: '',
        address: '',
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
