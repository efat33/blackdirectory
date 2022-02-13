import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
    education: any;
    edit: boolean;
}

@Component({
    selector: 'account-deactivate-modal',
    templateUrl: 'account-deactivate-modal.html',
    styleUrls: ['account-deactivate-modal.scss']
})

export class AccountDeactivateModal implements OnInit {

    deactivateForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<AccountDeactivateModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.deactivateForm = new FormGroup({
            request: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
          });
    }

    onSubmit() {
        this.dialogRef.close(this.deactivateForm.value);
    }
    
}