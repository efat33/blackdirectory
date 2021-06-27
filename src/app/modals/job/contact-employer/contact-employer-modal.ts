import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'contact-employer-modal',
    templateUrl: 'contact-employer-modal.html',
    styleUrls: ['contact-employer-modal.scss']
})

export class ContactEmployerModal implements OnInit {

    contactEmployerForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<ContactEmployerModal>
    ) {
        
    }

    ngOnInit(): void {
        this.contactEmployerForm = new FormGroup({
            subject: new FormControl('', Validators.required),
            message: new FormControl('', Validators.required)
          });
    }

    onSubmit() {
        
    }
    
}