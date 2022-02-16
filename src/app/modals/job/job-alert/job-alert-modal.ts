import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobService } from 'src/app/jobs/jobs.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { Subscription } from 'rxjs';

export interface DialogData {
    name: any;
    email: any;
    period: any;
}

@Component({
    selector: 'job-alert-modal',
    templateUrl: 'job-alert-modal.html',
    styleUrls: ['job-alert-modal.scss']
})

export class JobAlertModal implements OnInit {

    subscriptions: Subscription = new Subscription();
    
    jobAlertForm: FormGroup;
    showError = false;
    errorMessage = '';

    sectors = [];

    constructor(
        public jobService: JobService,
        private spinnerService: SpinnerService,
        private snackbar: SnackBarService,
        public dialogRef: MatDialogRef<JobAlertModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.getJobSectors();

        this.jobAlertForm = new FormGroup({
            name: new FormControl(this.data.name || '', Validators.required),
            email: new FormControl(this.data.email || '', Validators.required),
            period: new FormControl(this.data.period || '', Validators.required),
            salary: new FormControl(null, Validators.pattern('^[0-9.]*$')),
            keyword: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            sector: new FormControl('', Validators.required),
          });
    }

    getJobSectors() {
        this.spinnerService.show();
        this.jobService.getSectors().subscribe(
            (result: any) => {
            this.spinnerService.hide();
            this.sectors = result.data;
            },
            (error) => {
            this.spinnerService.hide();
            this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
            }
        );
    }

    onSelectOpen(opened: boolean, searchInput: any) {
        if (opened) {
            searchInput.focus();
        }
    }

    filteredJobSectors(searchString: any) {
        if (this.sectors.length > 0) {
          return this.sectors.filter((sector) => sector.title.toLowerCase().includes(searchString.toLowerCase()));
        }
    
        return [];
    }

    onSubmit() {

        this.spinnerService.show();
        const subsCreateAlert = this.jobService.newJobAlert(this.jobAlertForm.value).subscribe(
          (res:any) => {
            this.spinnerService.hide();
            this.snackbar.openSnackBar(res.message, 'Close');

            // close the modal
            this.dialogRef.close();
          },
          (res:any) => {
            this.spinnerService.hide();
            this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
          }
        );
        
        this.subscriptions.add(subsCreateAlert);
    }
    
}