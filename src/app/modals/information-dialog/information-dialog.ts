import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'information-dialog',
  templateUrl: 'information-dialog.html',
  styleUrls: ['./information-dialog.scss'],
})
export class InformationDialogComponent {
  constructor(public dialogRef: MatDialogRef<InformationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
}
