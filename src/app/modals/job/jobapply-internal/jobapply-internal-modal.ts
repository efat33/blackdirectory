import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'jobapply-internal-modal',
    templateUrl: 'jobapply-internal-modal.html',
    styleUrls: ['jobapply-internal-modal.scss']
})

export class JobApplyInternalModal implements OnInit {

    jobApplyForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<JobApplyInternalModal>
    ) {
        
    }

    ngOnInit(): void {
        this.jobApplyForm = new FormGroup({
            cover_letter: new FormControl('', Validators.required)
          });
    }

    onSubmit() {
        
    }
    
}