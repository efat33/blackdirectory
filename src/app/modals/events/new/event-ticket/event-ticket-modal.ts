import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
    formdata: any;
    edit: boolean;
}

@Component({
    selector: 'event-ticket-modal',
    templateUrl: 'event-ticket-modal.html',
    styleUrls: ['event-ticket-modal.scss']
})

export class EventTicketModal implements OnInit {

    ticketForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<EventTicketModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.ticketForm = new FormGroup({
            title: new FormControl(this.data.formdata?.title || '', Validators.required),
            price: new FormControl(this.data.formdata?.price || '', Validators.pattern('^[0-9.]*$')),
            capacity: new FormControl(this.data.formdata?.capacity || '', Validators.pattern('^[0-9.]*$')),
            start_sale: new FormControl(this.data.formdata?.start_sale || ''),
            end_sale: new FormControl(this.data.formdata?.end_sale || ''),
            id: new FormControl(this.data.formdata?.id || ''),
          });
    }

    onSubmit() {
        this.dialogRef.close(this.ticketForm.value);
    }
    
}