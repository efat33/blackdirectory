import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';
import { EventSearchCatModal } from 'src/app/modals/events/search/category/event-search-cat-modal';
import { EventSearchCityModal } from 'src/app/modals/events/search/cities/event-search-cities-modal';
import { EventSearchDateModal } from 'src/app/modals/events/search/date/event-search-date-modal';
import { EventSearchOrganizersModal } from 'src/app/modals/events/search/organizers/event-search-organizers-modal';
import { EventSearchVenueModal } from 'src/app/modals/events/search/venues/event-search-venues-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { EventService } from '../event.service';

declare const google: any;

@Component({
  selector: 'app-events-all',
  templateUrl: './events-all.component.html',
  styleUrls: ['./events-all.component.scss'],
})
export class EventsAllComponent implements OnInit {
  siteUrl: any;
  subscriptions: Subscription = new Subscription();

  eventSearchForm: FormGroup;
  showError = false;
  errorMessage = '';

  dialogRefCat: any;
  dialogRefOrganizer: any;
  dialogRefVenue: any;
  dialogRefCity: any;
  dialogRefDate: any;

  selectedCategory: string = null;
  selectedOrganizer: string = null;
  selectedTag: string = null;
  selectedVenue: string = null;
  selectedCity: string = null;

  categories: any = [];
  tags: any = [];
  organisers: any = [];
  events: any = [];

  totalItems = 0;

  queryParams = {
    keyword: '',
    lat: '',
    lng: '',
    limit: 12,
    offset: 0,
    page: 1,
    price: '',
    organisers: '',
    category: '',
    tag: '',
    start_time: '',
    end_time: '',
    featured: 0,
    is_virtual: 0,
  };
  pagination = {
    totalItems: 0,
    currentPage: 1,
    pageSize: this.queryParams.limit,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    pages: [],
  };

  locationModified = false;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    public eventService: EventService,
    public spinnerService: SpinnerService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.eventSearchForm.controls;
  }

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    // get event category from url
    const event_cat = this.route.snapshot.queryParamMap.get('cat');
    if (event_cat) {
      this.queryParams.category = event_cat;
    }
    // get event organiser from url
    const event_org = this.route.snapshot.queryParamMap.get('organiser');
    if (event_org) {
      this.queryParams.organisers = event_org;
    }
    // get event tag from url
    const event_tag = this.route.snapshot.queryParamMap.get('tag');
    if (event_tag) {
      this.queryParams.tag = event_tag;
    }

    this.eventSearchForm = new FormGroup({
      keyword: new FormControl(''),
      location: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl(''),
    });

    this.populateFilterOptions();
    this.initializeGoogleMap();

    this.onSubmit();
  }

  populateFilterOptions() {
    const subsEventCat = this.eventService.getCategories();
    const subsEventOrg = this.eventService.getOrganisers();
    const subsEventTag = this.eventService.getTags();

    forkJoin([subsEventCat, subsEventOrg, subsEventTag]).subscribe(
      (res: any) => {
        const categories = res[0].data;
        const organisers = res[1].data;
        const tags = res[2].data;

        // prepare categories
        for (const item of categories) {
          const tmp = { value: item.id, viewValue: item.title };
          this.categories.push(tmp);
        }

        // get event category from url
        const event_cat = this.route.snapshot.queryParamMap.get('cat');
        if (event_cat) {
          this.selectedCategory = this.categories.find((c) => c.value == event_cat).viewValue;
        }

        // prepare organisers
        for (const item of organisers) {
          const tmp = { value: item.id, viewValue: item.name };
          this.organisers.push(tmp);
        }

        // get event organiser from url
        const event_org = this.route.snapshot.queryParamMap.get('organiser');
        if (event_org) {
          this.selectedOrganizer = this.organisers.find((c) => c.value == event_org).viewValue;
        }

        // prepare tags
        for (const item of tags) {
          const tmp = { value: item.id, viewValue: item.title };
          this.tags.push(tmp);
        }

        // get event tag from url
        const event_tag = this.route.snapshot.queryParamMap.get('tag');
        if (event_tag) {
          this.selectedTag = this.tags.find((c) => c.value == event_tag).viewValue;
        }
      },
      (error) => {}
    );
  }

  initializeGoogleMap() {
    const latitude = this.eventSearchForm.get('lat');
    const longitude = this.eventSearchForm.get('lng');

    const input = document.querySelector('input[formControlName=location]') as HTMLInputElement;
    const address = this.eventSearchForm.get('location');

    const autocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
    };

    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);

    autocomplete.addListener('place_changed', () => {
      // infowindow.close();
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      address.setValue(place.formatted_address);
      latitude.setValue(place.geometry.location.lat());
      longitude.setValue(place.geometry.location.lng());
      this.locationModified = false;

      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    this.queryParams.keyword = this.f['keyword'].value;
    this.queryParams.lat = this.f['lat'].value;
    this.queryParams.lng = this.f['lng'].value;

    this.getEvents();
  }

  getEvents(page: number = 1) {
    this.queryParams.page = page;
    this.queryParams.offset = (page - 1) * this.queryParams.limit;

    this.spinnerService.show();

    const subsSearchEvent = this.eventService.searchEvent(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.events = res.data.events;
        this.totalItems = res.data.total_events;
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsSearchEvent);
  }

  onPageChange(newPage: number) {
    this.getEvents(newPage);
  }

  // openEventCityModal(): void {
  //   this.dialogRefCity = this.dialog.open(EventSearchCityModal, {
  //     width: '400px',
  //     data: { option: this.queryParams.city}
  //   });

  //   this.dialogRefCity.afterClosed().subscribe((result) => {
  //     this.queryParams.city = result.value;
  //     this.selectedCity = result.viewValue;

  //   });

  //   this.subscriptions.add(this.dialogRefCity);

  // }

  // openEventVenueModal(): void {
  //   this.dialogRefVenue = this.dialog.open(EventSearchVenueModal, {
  //     width: '400px',
  //     data: { option: this.queryParams.venue}
  //   });

  //   this.dialogRefVenue.afterClosed().subscribe((result) => {
  //     this.queryParams.venue = result.value;
  //     this.selectedVenue = result.viewValue;

  //   });

  //   this.subscriptions.add(this.dialogRefVenue);

  // }

  openEventOrganizerModal(): void {
    this.dialogRefOrganizer = this.dialog.open(EventSearchOrganizersModal, {
      width: '400px',
      data: { option: this.queryParams.organisers, options: this.organisers },
    });

    this.dialogRefOrganizer.afterClosed().subscribe((result) => {
      this.queryParams.organisers = result.value;
      this.selectedOrganizer = result.viewValue;
      // call the function which would handle the entire search query
      this.onSubmit();
    });

    this.subscriptions.add(this.dialogRefOrganizer);
  }

  openEventCategoryModal(): void {
    this.dialogRefCat = this.dialog.open(EventSearchCatModal, {
      width: '400px',
      data: { category: this.queryParams.category, categories: this.categories },
    });

    this.dialogRefCat.afterClosed().subscribe((result) => {
      this.queryParams.category = result.value;
      this.selectedCategory = result.viewValue;
      // call the function which would handle the entire search query
      this.onSubmit();
    });

    this.subscriptions.add(this.dialogRefCat);
  }

  openEventDateModal(): void {
    this.dialogRefDate = this.dialog.open(EventSearchDateModal, {
      width: '400px',
      data: { start_time: this.queryParams.start_time, end_time: this.queryParams.end_time },
    });

    this.dialogRefDate.afterClosed().subscribe((result) => {
      this.queryParams.start_time = result.start_time;
      this.queryParams.end_time = result.end_time;
      // call the function which would handle the entire search query
      this.onSubmit();
    });

    this.subscriptions.add(this.dialogRefDate);
  }

  onClickNewEvent() {
    if (this.helperService.currentUserInfo?.id) {
      this.router.navigate(['events/new']);
    } else {
      this.userService.onLoginLinkModal.emit();
    }
  }

  onLocationBlur() {
    if (this.locationModified) {
      this.eventSearchForm.patchValue({
        lat: '',
        lng: '',
        location: '',
      });
    }
  }
}
