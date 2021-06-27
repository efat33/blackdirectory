import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit, OnDestroy {

  sectors = [
    { value: 1, viewValue: 'steak-0'},
    { value: 2, viewValue: 'pizza-1'},
    { value: 3, viewValue: 'tacos-2'}
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
  jobTypes = [
    { value: 'contract', viewValue: 'Contract'},
    { value: 'full-time', viewValue: 'Full Time'},
    { value: 'internship', viewValue: 'Internship'},
    { value: 'part-time', viewValue: 'Part Time'},
    { value: 'temporary', viewValue: 'Temporary'},
  ];
  jobApplyTypes = [
    { value: 'internal', viewValue: 'Internal (Receive Applications Here)'},
    { value: 'external', viewValue: 'External URL'},
    { value: 'with_email', viewValue: 'By Email'},
  ];
  jobExperiences = [
    { value: 'no-experience', viewValue: 'No Experience'},
    { value: 'less-than-1-year', viewValue: 'Less Than 1 Year'},
    { value: '2-years', viewValue: '2 Years'},
    { value: '3-years', viewValue: '3 Years'},
    { value: '4-years', viewValue: '4 Years'},
    { value: '5-years', viewValue: '5 Years'},
    { value: '6-years', viewValue: '6 Years'},
    { value: '7-years', viewValue: '7 Years'},
    { value: '8-years-+', viewValue: '8 Years +'}
  ];


  subsciptions: Subscription = new Subscription();

  jobForm: FormGroup;
  showError = false;
  errorMessage = '';

  constructor(
    
  ) { }

  ngOnInit() {
    this.jobForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      deadline: new FormControl('', Validators.required),
      job_sector_id: new FormControl('', Validators.required),
      job_type: new FormControl('', Validators.required),
      job_apply_type: new FormControl(''),
      job_industry: new FormControl(''),
      experience: new FormControl(''),
      salary: new FormControl(''),

      address: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),

      attachment: new FormControl(''),
      
    });
  }

  onSubmit() {

  }

  ngOnDestroy() {
    
  }


}
