import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

export interface DialogData {
    experience: any;
    edit: boolean;
}

@Component({
    selector: 'candidate-experience-modal',
    templateUrl: 'candidate-experience-modal.html',
    styleUrls: ['candidate-experience-modal.scss']
})

export class CandidateExperienceModal implements OnInit {

    experienceForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<CandidateExperienceModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

     // convenience getter for easy access to form fields
     get f() { return this.experienceForm.controls; }

    ngOnInit(): void {
        this.experienceForm = new FormGroup({
            title: new FormControl(this.data.experience?.title || '', Validators.required),
            start_date: new FormControl(this.data.experience?.start_date || '', Validators.required),
            end_date: new FormControl(this.data.experience?.end_date || ''),
            present: new FormControl(this.data.experience?.present || ''),
            company: new FormControl(this.data.experience?.company || '', Validators.required),
            description: new FormControl(this.data.experience?.description || ''),
            id: new FormControl(this.data.experience?.id || ''),
          });
    }

    onSubmit() {
        // remove timezone from date, using moment
        this.experienceForm.get('start_date').patchValue(moment(this.f.start_date.value).format("YYYY-MM-DD"));
        this.experienceForm.get('end_date').patchValue(moment(this.f.end_date.value).format("YYYY-MM-DD"));

        this.dialogRef.close(this.experienceForm.value);
    }
    
}