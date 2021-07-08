import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'jobapply-internal-modal',
  templateUrl: 'jobapply-internal-modal.html',
  styleUrls: ['jobapply-internal-modal.scss'],
})
export class JobApplyInternalModal implements OnInit {
  jobApplyForm: FormGroup;
  showError = false;
  errorMessage = '';

  constructor(public dialogRef: MatDialogRef<JobApplyInternalModal>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.jobApplyForm = new FormGroup({
      cover_letter: new FormControl(this.data.coverLetter || '', Validators.required),
    });
  }

  onSubmit() {
    this.dialogRef.close(this.jobApplyForm.value.cover_letter);
  }
}
