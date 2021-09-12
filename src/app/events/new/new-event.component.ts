import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';
import { EventRsvpModal } from 'src/app/modals/events/new/event-rsvp/event-rsvp-modal';
import { EventTicketModal } from 'src/app/modals/events/new/event-ticket/event-ticket-modal';
import { NewOrganizerModal } from 'src/app/modals/events/new/new-organizer/new-organizer-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { EventService } from '../event.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ActivatedRoute, Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
})
export class NewEventComponent implements OnInit {
  subscriptions: Subscription = new Subscription();

  hours = [
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

  rec_start_monthday = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

  formDropdown = {
    categories: [],
    tags: [],
    oranizers: [],
  };

  ckEditor = DocumentEditor;
  ckConfig = {
    placeholder: 'Event Description',
    height: 200,
    toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList'],
  };

  map: any;
  mapMarker: any;

  eventSlug: string;
  eventForm: FormGroup;
  showError = false;
  errorMessage = '';

  dialogRefOrganizer: any;
  dialogRefTicket: any;
  dialogRefRsvp: any;

  featuredImageSrc: string;
  progressFeaturedImg: number = 0;
  removedTickets: any = [];
  removedRsvp: any = [];

  formCustomvalidation = {
    featuredImage: {
      validated: true,
      message: '',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public helperService: HelperService,
    public uploadService: UploadService,
    public eventService: EventService,
    public spinnerService: SpinnerService,
    public snackbarService: SnackBarService,
    private cdk: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.eventSlug = this.route.snapshot.paramMap.get('slug');

    this.setupEventForm();
    this.initializeGoogleMap();

    // populate category, orgainsers etc dropdown
    this.prepareEventForm();

    if (this.eventSlug != null) {
      this.spinnerService.show();

      const subsGetEvent = this.eventService.getEvent(this.eventSlug, true).subscribe(
        (res: any) => {
          this.spinnerService.hide();

          // redirect to home page if listing user_id OR claimer_id not equal to current user id
          if (
            !this.helperService.isAdmin() &&
            this.helperService.currentUserInfo.id !== res.data.user_id
          ) {
            this.router.navigate(['home']);
            return;
          }

          this.populateEventForm(res.data);
        },
        (res: any) => {
          this.spinnerService.hide();
          this.snackbarService.openSnackBar(res.error.message, '', 'warn');
        }
      );

      this.subscriptions.add(subsGetEvent);
    }
  }

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
  }

  prepareEventForm() {
    this.spinnerService.show();

    const subsCategories = this.eventService.getCategories();
    const subsOrganisers = this.eventService.getOrganisers();
    const subsTags = this.eventService.getTags();

    forkJoin([subsCategories, subsOrganisers, subsTags]).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        const categories = res[0].data;
        const organisers = res[1].data;
        const tags = res[2].data;

        for (const item of categories) {
          const tmp = { value: item.id, viewValue: item.title };
          this.formDropdown.categories.push(tmp);
        }

        for (const item of organisers) {
          const tmp = { value: item.id, viewValue: item.name };
          this.formDropdown.oranizers.push(tmp);
        }

        for (const item of tags) {
          const tmp = { value: item.id, viewValue: item.title };
          this.formDropdown.tags.push(tmp);
        }
      },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  initializeGoogleMap() {
    const latitude = this.eventForm.get('latitude');
    const longitude = this.eventForm.get('longitude');

    const mapProp = {
      zoom: 10,
      scrollwheel: true,
      zoomControl: true,
    };

    this.map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
    const geocoder = new google.maps.Geocoder();
    const input = document.querySelector('input[formControlName=address]') as HTMLInputElement;
    const address = this.eventForm.get('address');
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

  populateEventForm(event: any) {
    const categories = event.categories.map((c) => c.category_id);
    const tags = event.tags.map((c) => c.tag_id);

    this.eventForm.patchValue({
      id: event.id,
      title: event.title,
      description: event.description,
      featured_img: event.featured_img,
      category_id: categories,
      tag_id: categories,
      address: event.address,
      latitude: event.latitude,
      longitude: event.longitude,
      is_virtual: event.is_virtual,
      youtube_url: event.youtube_url,
      website_url: event.website_url,
      start_time: event.start_time,
      end_time: event.end_time,
    });

    // set images source
    this.featuredImageSrc = this.helperService.getImageUrl(event.featured_img, 'event', 'thumb');

    // populate organisers
    if (event.organisers && event.organisers.length > 0) {
      (this.eventForm.get('organizers') as FormArray).removeAt(0);
      for (const item of event.organisers) {
        (this.eventForm.get('organizers') as FormArray).push(new FormControl(item.organizer_id));
      }
    }

    // populate tickets
    if (event.tickets && event.tickets.length > 0) {
      for (const [key, item] of event.tickets.entries()) {
        const variationGroup = new FormGroup({
          id: new FormControl(item.id),
          title: new FormControl(item.title),
          price: new FormControl(item.price),
          capacity: new FormControl(item.capacity),
          available: new FormControl(item.available),
          start_sale: new FormControl(item.start_sale),
          end_sale: new FormControl(item.end_sale),
        });

        (this.eventForm.get('tickets') as FormArray).push(variationGroup);
      }
    }

    // populate rsvp
    if (event.rsvp && event.rsvp.length > 0) {
      for (const [key, item] of event.rsvp.entries()) {
        const variationGroup = new FormGroup({
          id: new FormControl(item.id),
          title: new FormControl(item.title),
          available: new FormControl(item.available),
          capacity: new FormControl(item.capacity),
          start_sale: new FormControl(item.start_sale),
          end_sale: new FormControl(item.end_sale),
        });

        (this.eventForm.get('rsvp') as FormArray).push(variationGroup);
      }
    }

    const latlng = {
      lat: parseFloat(event.latitude),
      lng: parseFloat(event.longitude),
    };

    this.map.setCenter(latlng);
    this.mapMarker.setPosition(latlng);
  }

  setupEventForm() {
    this.eventForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      featured_img_input: new FormControl(''),
      featured_img: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
      tag_id: new FormControl(''),
      address: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      is_virtual: new FormControl(''),
      youtube_url: new FormControl(''),
      website_url: new FormControl(''),

      organizers: new FormArray([new FormControl('', Validators.required)]),

      tickets: new FormArray([]),
      rsvp: new FormArray([]),

      event_type: new FormControl('one_time'),
      start_time: new FormControl(''),
      end_time: new FormControl(''),

      recurrence_type: new FormControl(''),
      recurrence_interval: new FormControl(''),
      days_of_weeks: new FormControl(''),
      months_of_year: new FormControl(''),
      rec_start_date: new FormControl(''),
      rec_start_weekday: new FormControl(''),
      rec_start_monthday: new FormControl(''),
      rec_start_time: new FormControl(''),
      rec_end_date: new FormControl(''),
      rec_end_time: new FormControl(''),
      series_end_type: new FormControl(''),
      series_end_number: new FormControl(''),
      series_end_date: new FormControl(''),
    });

    if (this.eventSlug != null) {
      this.eventForm.addControl('removedRsvp', new FormControl(''));
      this.eventForm.addControl('removedTickets', new FormControl(''));
    }
  }

  onSubmit() {
    // reset form error
    this.showError = false;
    this.errorMessage = '';

    const formData = this.eventForm.getRawValue();
    formData.start_time = formData.start_time ? moment(formData.start_time).utc().format('YYYY-MM-DD HH:mm:ss') : '';
    formData.end_time = formData.end_time ? moment(formData.end_time).utc().format('YYYY-MM-DD HH:mm:ss') : '';

    for (let index = 0; index < formData.tickets.length; index++) {
      const element = formData.tickets[index];
      element.start_sale = element.start_sale
        ? moment(element.start_sale).utc().format('YYYY-MM-DD HH:mm:ss')
        : formData.start_time;
      element.end_sale = element.end_sale
        ? moment(element.end_sale).utc().format('YYYY-MM-DD HH:mm:ss')
        : formData.end_time;
    }
    for (let index = 0; index < formData.rsvp.length; index++) {
      const element = formData.rsvp[index];
      element.start_sale = element.start_sale
        ? moment(element.start_sale).utc().format('YYYY-MM-DD HH:mm:ss')
        : formData.start_time;
      element.end_sale = element.end_sale
        ? moment(element.end_sale).utc().format('YYYY-MM-DD HH:mm:ss')
        : formData.end_time;
    }

    if (this.eventSlug) {
      this.editEvent(formData);
    } else {
      this.createEvent(formData);
    }
  }

  createEvent(formData) {
    this.spinnerService.show();

    const subsNewEvent = this.eventService.newEvent(formData).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.snackbarService.openSnackBar(res.message);

        setTimeout(() => {
          this.router.navigate([`events/details/${res.data.slug}`]);
        }, 1000);
      },
      (res: any) => {
        this.spinnerService.hide();
        this.showError = true;
        this.errorMessage = res.error.message;
      }
    );

    this.subscriptions.add(subsNewEvent);
  }

  editEvent(formData) {
    this.spinnerService.show();

    const subsNewEvent = this.eventService.editEvent(formData).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.snackbarService.openSnackBar(res.message);

        setTimeout(() => {
          this.router.navigate([`events/details/${this.eventSlug}`]);
        }, 1000);
      },
      (res: any) => {
        this.spinnerService.hide();
        this.showError = true;
        this.errorMessage = res.error.message;
      }
    );

    this.subscriptions.add(subsNewEvent);
  }

  /**
   * ======================================
   * event rsvp
   * ======================================
   */

  // remove event ticket from Form Array
  removeEventRsvp(index: number, rsvp?: any) {
    (this.eventForm.get('rsvp') as FormArray).removeAt(index);
    this.removedRsvp.push(rsvp);

    if (this.eventSlug != null) {
      this.eventForm.get('removedRsvp').patchValue(JSON.stringify(this.removedRsvp));
    }
  }

  // add / edit ticket of formArray
  addEventRsvp(formData?: any, isEdit?: boolean, index?: number) {
    if (isEdit) {
      const formGroup = (this.eventForm.get('rsvp') as FormArray).at(index) as FormGroup;
      formGroup.get('id').patchValue(formData.id);
      formGroup.get('title').patchValue(formData.title);
      formGroup.get('capacity').patchValue(formData.capacity);
      formGroup.get('start_sale').patchValue(formData.start_sale);
      formGroup.get('end_sale').patchValue(formData.end_sale);
    } else {
      const variationGroup = new FormGroup({
        id: new FormControl(formData.id || ''),
        title: new FormControl(formData.title || ''),
        capacity: new FormControl(formData.capacity || ''),
        start_sale: new FormControl(formData.start_sale || ''),
        end_sale: new FormControl(formData.end_sale || ''),
      });
      (this.eventForm.get('rsvp') as FormArray).push(variationGroup);
    }
  }

  // open ticket modal
  openRsvpModal(formdata?: any, index?: number): void {
    this.dialogRefRsvp = this.dialog.open(EventRsvpModal, {
      width: '500px',
      data: { formdata, edit: !!formdata },
    });

    this.dialogRefRsvp.afterClosed().subscribe((result) => {
      if (result) this.addEventRsvp(result, !!formdata, index);
    });

    this.subscriptions.add(this.dialogRefRsvp);
  }

  /**
   * ======================================
   * event ticket
   * ======================================
   */

  // remove event ticket from Form Array
  removeEventTicket(index: number, ticket?: any) {
    (this.eventForm.get('tickets') as FormArray).removeAt(index);
    this.removedTickets.push(ticket);

    if (this.eventSlug != null) {
      this.eventForm.get('removedTickets').patchValue(JSON.stringify(this.removedTickets));
    }
  }

  // add / edit ticket of formArray
  addEventTicket(formData?: any, isEdit?: boolean, index?: number) {
    if (isEdit) {
      const formGroup = (this.eventForm.get('tickets') as FormArray).at(index) as FormGroup;
      formGroup.get('id').patchValue(formData.id);
      formGroup.get('title').patchValue(formData.title);
      formGroup.get('price').patchValue(formData.price);
      formGroup.get('capacity').patchValue(formData.capacity);
      formGroup.get('start_sale').patchValue(formData.start_sale);
      formGroup.get('end_sale').patchValue(formData.end_sale);
    } else {
      const variationGroup = new FormGroup({
        id: new FormControl(formData.id || ''),
        title: new FormControl(formData.title || ''),
        price: new FormControl(formData.price || ''),
        capacity: new FormControl(formData.capacity || ''),
        start_sale: new FormControl(formData.start_sale || ''),
        end_sale: new FormControl(formData.end_sale || ''),
      });
      (this.eventForm.get('tickets') as FormArray).push(variationGroup);
    }
  }

  // open ticket modal
  openTicketModal(formdata?: any, index?: number): void {
    this.dialogRefTicket = this.dialog.open(EventTicketModal, {
      width: '500px',
      data: { formdata, edit: !!formdata },
    });

    this.dialogRefTicket.afterClosed().subscribe((result) => {
      if (result) this.addEventTicket(result, !!formdata, index);
    });

    this.subscriptions.add(this.dialogRefTicket);
  }

  // open organizer modal
  openOrganizerModal(): void {
    this.dialogRefOrganizer = this.dialog.open(NewOrganizerModal, {
      width: '500px',
    });

    this.dialogRefOrganizer.afterClosed().subscribe((result) => {
      if (result) {
        // update organizers array
        this.formDropdown.oranizers.push(result);

        // add field to eventForm organizer
        this.addOrganizerField(result.value);
      }
    });

    this.subscriptions.add(this.dialogRefOrganizer);
  }

  // remove organizer field from organizers FormArray
  removeOrganizerField(index: number) {
    (this.eventForm.get('organizers') as FormArray).removeAt(index);
  }

  // add more organizer dropdown field
  addOrganizerField(organizer_id?: number) {
    (this.eventForm.get('organizers') as FormArray).push(new FormControl(organizer_id ? organizer_id : ''));
  }

  // focus input search field when dropdown clicked
  onSelectOpen(opened: boolean, searchInput: any) {
    if (opened) {
      searchInput.focus();
    }
  }

  // filter dropdown options
  filteredDropdownOptions(searchString: any, dropdown: string) {
    if (this.formDropdown[dropdown]) {
      return this.formDropdown[dropdown].filter((option) =>
        option.viewValue.toLowerCase().includes(searchString.toLowerCase())
      );
    }

    return [];
  }

  // featured image input change
  onFeaturedImageChange(event) {
    // reset validation
    this.formCustomvalidation.featuredImage.validated = true;

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
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

      this.uploadService.uploadImage(fd, 'event').subscribe((event: HttpEvent<any>) => {
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
              this.eventForm.get('featured_img').patchValue(event.body.data.filename);
            }

            // hide progress bar
            setTimeout(() => {
              this.progressFeaturedImg = 0;
            }, 1000);
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
