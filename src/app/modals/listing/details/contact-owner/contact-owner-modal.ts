import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
    id: number;
    username: string;
}

@Component({
    selector: 'contact-owner-modal',
    templateUrl: 'contact-owner-modal.html',
    styleUrls: ['contact-owner-modal.scss']
})

export class ContactOwnerModal implements OnInit {

    contactOwnerForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<ContactOwnerModal>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.contactOwnerForm = new FormGroup({
            username: new FormControl({value: this.data.username, disabled: true}, Validators.required),
            message: new FormControl('', Validators.required)
          });
    }

    onSubmit() {
        
    }
    
}