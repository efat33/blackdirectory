import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
    education: any;
    edit: boolean;
}

@Component({
    selector: 'candidate-education-modal',
    templateUrl: 'candidate-education-modal.html',
    styleUrls: ['candidate-education-modal.scss']
})

export class CandidateEducationModal implements OnInit {

    educationForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<CandidateEducationModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.educationForm = new FormGroup({
            title: new FormControl(this.data.education?.title || '', Validators.required),
            year: new FormControl(this.data.education?.year || '', [Validators.required, , Validators.pattern('^[0-9.]*$')]),
            institute: new FormControl(this.data.education?.institute || '', Validators.required),
            description: new FormControl(this.data.education?.description || ''),
            id: new FormControl(this.data.education?.id || ''),
          });
    }

    onSubmit() {
        this.dialogRef.close(this.educationForm.value);
    }
    
}