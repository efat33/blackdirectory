import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { EventService } from 'src/app/events/event.service';

export interface DialogData {
    rsvp_id: number
}

@Component({
    selector: 'rsvp-apply-modal',
    templateUrl: 'rsvp-apply-modal.html',
    styleUrls: ['rsvp-apply-modal.scss']
})

export class RsvpApplyModal implements OnInit {

    subscriptions = new Subscription();

    rsvpApplyForm: FormGroup;
    showError = false;
    errorMessage = '';

    constructor(
        public dialogRef: MatDialogRef<RsvpApplyModal>,
        private spinnerService: SpinnerService,
        private eventService: EventService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.rsvpApplyForm = new FormGroup({
            rsvp_id: new FormControl(this.data.rsvp_id ? this.data.rsvp_id : ''),
            name: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            guest_no: new FormControl('', [
                Validators.required,
                Validators.pattern("^[0-9]*$"),
            ]),
          });
    }

    onSubmit() {
        this.showError = false;
        this.errorMessage = '';

        this.spinnerService.show();
        
        const subsRsvpApplyModal = this.eventService.rsvpApply(this.rsvpApplyForm.value).subscribe(
          (res:any) => {
        
            this.spinnerService.hide();

            this.dialogRef.close({guest_no: this.rsvpApplyForm.get('guest_no').value});
          },
          (res:any) => {
            this.spinnerService.hide();
            this.showError = true;
            this.errorMessage = res.error.message;
          }
        );
        
        this.subscriptions.add(subsRsvpApplyModal);
    }

    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }
    
}