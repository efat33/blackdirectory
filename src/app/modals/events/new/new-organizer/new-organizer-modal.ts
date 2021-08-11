import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from 'src/app/events/event.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';


@Component({
    selector: 'new-organizer-modal',
    templateUrl: 'new-organizer-modal.html',
    styleUrls: ['new-organizer-modal.scss']
})

export class NewOrganizerModal implements OnInit {

    subscriptions = new Subscription()
    organizerForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<NewOrganizerModal>,
        private eventService: EventService,
        private spinnerService: SpinnerService,
        private snackbarService: SnackBarService,
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
        this.spinnerService.show();
        
        const subsNewOrganiser = this.eventService.newOrganiser(this.organizerForm.value).subscribe(
          (res:any) => {
            this.spinnerService.hide();

            if(res.status == 200){

                this.snackbarService.openSnackBar(res.message);

                // send data back to component
                this.dialogRef.close({ value: res.data, viewValue: this.organizerForm.get('name').value});
            }
          },
          (res:any) => {
            this.spinnerService.hide();
            this.snackbarService.openSnackBar(res.error.message, '', 'warn');
          }
        );
        
        this.subscriptions.add(subsNewOrganiser);

        
    }
    

    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }

}