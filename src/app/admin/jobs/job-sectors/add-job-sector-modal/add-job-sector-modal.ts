import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { JobService } from 'src/app/jobs/jobs.service';

@Component({
  selector: 'add-job-sector-modal',
  templateUrl: 'add-job-sector-modal.html',
  styleUrls: ['./add-job-sector-modal.scss'],
})
export class AddJobSectorModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  jobSectorForm: FormGroup;
  sector: any = {};

  constructor(
    private dialogRef: MatDialogRef<AddJobSectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private jobService: JobService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.sector = this.data?.sector || {};
  }

  ngOnInit(): void {
    this.jobSectorForm = new FormGroup({
      title: new FormControl(this.sector.title || '', Validators.required),
    });
  }

  onSubmit() {
    if (this.sector.id) {
      this.editSector();
    } else {
      this.addSector();
    }
  }

  addSector() {
    this.spinnerService.show();
    const subscription = this.jobService.addJobSector(this.jobSectorForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Sector added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editSector() {
    this.spinnerService.show();
    const subscription = this.jobService.editJobSector(this.sector.id, this.jobSectorForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Sector updated');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
