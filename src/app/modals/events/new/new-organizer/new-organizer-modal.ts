import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'new-organizer-modal',
    templateUrl: 'new-organizer-modal.html',
    styleUrls: ['new-organizer-modal.scss']
})

export class NewOrganizerModal implements OnInit {

    organizerForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<NewOrganizerModal>
    ) {
        
    }

    ngOnInit(): void {
        this.organizerForm = new FormGroup({
            name: new FormControl('', Validators.required),
            phone: new FormControl('', Validators.required),
            website: new FormControl(''),
            email: new FormControl(''),
          });
    }

    onSubmit() {
        // TODO: insert organizer into database

        // send data back to component
        this.dialogRef.close({ value: 99, viewValue: this.organizerForm.get('name').value});
    }
    
}