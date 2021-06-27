import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EventSearchCatModal } from 'src/app/modals/events/search/category/event-search-cat-modal';
import { EventSearchCityModal } from 'src/app/modals/events/search/cities/event-search-cities-modal';
import { EventSearchOrganizersModal } from 'src/app/modals/events/search/organizers/event-search-organizers-modal';
import { EventSearchVenueModal } from 'src/app/modals/events/search/venues/event-search-venues-modal';

@Component({
  selector: 'app-events-all',
  templateUrl: './events-all.component.html',
  styleUrls: ['./events-all.component.scss']
})

export class EventsAllComponent implements OnInit {

  subscriptions: Subscription = new Subscription();

  eventSearchForm: FormGroup;
  showError = false;
  errorMessage = '';

  dialogRefCat: any;
  dialogRefOrganizer: any;
  dialogRefVenue: any;
  dialogRefCity: any;

  selectedCategory: string = null;
  selectedOrganizer: string = null;
  selectedVenue: string = null;
  selectedCity: string = null;
  queryParams = { 
    category: null,
    organizer: null,
    venue: null,
    city: null,
  };

  constructor(
    public dialog: MatDialog,
  ) { }


  ngOnInit() {
    this.eventSearchForm = new FormGroup({
      keyword: new FormControl(''),
      location: new FormControl('')
      
    });
  }

  onSubmit() {
    
  }

  openEventCityModal(): void {
    this.dialogRefCity = this.dialog.open(EventSearchCityModal, {
      width: '400px',
      data: { option: this.queryParams.city}
    });

    this.dialogRefCity.afterClosed().subscribe((result) => {
      this.queryParams.city = result.value;
      this.selectedCity = result.viewValue;
      // TODO: call the function which would handle the entire search query

    });

    this.subscriptions.add(this.dialogRefCity);

  }

  openEventVenueModal(): void {
    this.dialogRefVenue = this.dialog.open(EventSearchVenueModal, {
      width: '400px',
      data: { option: this.queryParams.venue}
    });

    this.dialogRefVenue.afterClosed().subscribe((result) => {
      this.queryParams.venue = result.value;
      this.selectedVenue = result.viewValue;
      // TODO: call the function which would handle the entire search query

    });

    this.subscriptions.add(this.dialogRefVenue);

  }

  openEventOrganizerModal(): void {
    this.dialogRefOrganizer = this.dialog.open(EventSearchOrganizersModal, {
      width: '400px',
      data: { option: this.queryParams.organizer}
    });

    this.dialogRefOrganizer.afterClosed().subscribe((result) => {
      this.queryParams.organizer = result.value;
      this.selectedOrganizer = result.viewValue;
      // TODO: call the function which would handle the entire search query

    });

    this.subscriptions.add(this.dialogRefOrganizer);

  }

  openEventCategoryModal(): void {
    this.dialogRefCat = this.dialog.open(EventSearchCatModal, {
      width: '400px',
      data: { category: this.queryParams.category}
    });

    this.dialogRefCat.afterClosed().subscribe((result) => {
      this.queryParams.category = result.value;
      this.selectedCategory = result.viewValue;
      // TODO: call the function which would handle the entire search query

    });

    this.subscriptions.add(this.dialogRefCat);

  }


}

