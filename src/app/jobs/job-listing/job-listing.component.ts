import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss']
})

export class JobListingComponent implements OnInit {

  sectors = [
    { value: 1, viewValue: 'Arts & Media'},
    { value: 2, viewValue: 'Education'},
    { value: 3, viewValue: 'Accounting/ Finance/ Legal'},
    { value: 4, viewValue: 'Medical/Healthcare'},
    { value: 5, viewValue: 'Business Services'},
    { value: 6, viewValue: 'Retail/Sales'},
    { value: 7, viewValue: 'Information Technology'},
    { value: 8, viewValue: 'Other'},
  ];
  datePosted = [
    { value: '1hour', viewValue: 'Last Hour'},
    { value: '24hours', viewValue: 'Last 24 hours'},
    { value: '7days', viewValue: 'Last 7 days'},
    { value: '14days', viewValue: 'Last 14 days'},
    { value: '30days', viewValue: 'Last 30 days'},
    { value: 'all', viewValue: 'All'},
  ];
  jobTypes = [
    { value: 'apprenticeship', viewValue: 'Apprenticeship'},
    { value: 'contract', viewValue: 'Contract'},
    { value: 'freelance', viewValue: 'Freelance'},
    { value: 'full-time', viewValue: 'Full Time'},
    { value: 'graduate-scheme', viewValue: 'Graduate Scheme'},
    { value: 'internship', viewValue: 'Internship'},
    { value: 'part-time', viewValue: 'Part Time'},
    { value: 'temporary', viewValue: 'Temporary'}
  ];

  jobFilterForm: FormGroup;
  showError = false;
  errorMessage = '';

  constructor() { }


  ngOnInit() {
    this.jobFilterForm = new FormGroup({
      keyword: new FormControl(''),
      location: new FormControl(''),
      loc_radius: new FormControl(''),
      sector: new FormControl(''),
      
    });
  }

  onSubmit() {
    
  }

  onSelectOpen(opened: boolean, searchInput: any) {
    if (opened) {
      searchInput.focus();
    }
  }

  filteredJobSectors(searchString: any) {
    if (this.sectors) {
      return this.sectors.filter((sector) => sector.viewValue.toLowerCase().includes(searchString.toLowerCase()));
    }

    return [];
  }


}

