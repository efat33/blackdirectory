import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'jobapply-email-modal',
    templateUrl: 'jobapply-email-modal.html',
    styleUrls: ['jobapply-email-modal.scss']
})

export class JobApplyEmailModal implements OnInit {

    industries = [
        { value: 'Arts & Media', viewValue: 'Arts & Media'},
        { value: 'Education', viewValue: 'Education'},
        { value: 'Accounting/ Finance/ Legal', viewValue: 'Accounting/ Finance/ Legal'},
        { value: 'Medical/Healthcare', viewValue: 'Medical/Healthcare'},
        { value: 'Business Services', viewValue: 'Business Services'},
        { value: 'Retail/Sales', viewValue: 'Retail/Sales'},
        { value: 'Information Technology', viewValue: 'Information Technology'},
        { value: 'Other', viewValue: 'Other'},
    ];
    ages = [
        { value: '16 - 18 Years', viewValue: '16 - 18 Years'},
        { value: '19 - 22 Years', viewValue: '19 - 22 Years'},
        { value: '23 - 27 Years', viewValue: '23 - 27 Years'},
        { value: '28 - 35 Years', viewValue: '28 - 35 Years'},
        { value: '36 - 45 Years', viewValue: '36 - 45 Years'},
        { value: '46 - 55 Years', viewValue: '46 - 55 Years'},
        { value: '56 - 65 Years', viewValue: '56 - 65 Years'},
        { value: 'Above 65 Years', viewValue: 'Above 65 Years'},
    ];
    genders = [
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

    jobApplyForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<JobApplyEmailModal>
    ) {
        
    }

    ngOnInit(): void {
        this.jobApplyForm = new FormGroup({
            first_name: new FormControl(''),
            last_name: new FormControl(''),
            email: new FormControl('', Validators.required),
            phone: new FormControl(''),
            job_title: new FormControl(''),
            current_salary: new FormControl(''),
            academics: new FormControl('', Validators.required),
            age: new FormControl(''),
            industry: new FormControl(''),
            gender: new FormControl(''),
            resume: new FormControl(''),
            message: new FormControl(''),
          });
    }

    onSubmit() {
        
    }
    
}