import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    message: string;
}

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.html',
    styleUrls: ['confirmation-dialog.scss']
})

export class ConfirmationDialog {

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}



}