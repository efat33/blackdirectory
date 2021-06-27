import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-applicants',
  templateUrl: './all-applicants.component.html',
  styleUrls: ['./all-applicants.component.css']
})
export class AllApplicantsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();
  filterJobForm: FormGroup;

  jobTitles = [
    { value: 'Monthly', viewValue: 'Monthly'},
    { value: 'Weekly', viewValue: 'Weekly'},
    { value: 'Hourly', viewValue: 'Hourly'},
    { value: 'Annually', viewValue: 'Annually'},
  ];

  constructor(
    
  ) { }

  ngOnInit() {
    this.filterJobForm = new FormGroup({
      job_title: new FormControl('')
    });
  }

  onSubmit() {

  }

  onSelectOpen(opened: boolean, searchInput: any) {
    if (opened) {
      searchInput.focus();
    }
  }

  filteredJobTitles(searchString: any) {
    if (this.jobTitles) {
      return this.jobTitles.filter((jobTitle) => jobTitle.value.toLowerCase().includes(searchString.toLowerCase()));
    }

    return [];
  }

  ngOnDestroy() {
    
  }


}
