import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/events/event.service';

export interface DialogData {
    start_time: any,
    end_time: any
}

@Component({
    selector: 'event-search-date-modal',
    templateUrl: 'event-search-date-modal.html',
    styleUrls: ['event-search-date-modal.scss']
})

export class EventSearchDateModal implements OnInit {

    subscriptions = new Subscription();

    chosenStartTime: any;
    chosenEndTime: any;

    constructor(
        public dialogRef: MatDialogRef<EventSearchDateModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private eventService: EventService
    ) {
        
    }

    ngOnInit(): void {
        this.chosenStartTime = this.data.start_time;
        this.chosenEndTime = this.data.end_time;
    }

    onSubmit() {
        this.dialogRef.close();
    }

    onApply() {
        if(this.chosenStartTime && this.chosenEndTime){
            const start_time = moment(this.chosenStartTime).utc().format('YYYY-MM-DD');
            const end_time = moment(this.chosenEndTime).utc().format('YYYY-MM-DD');

            this.dialogRef.close({start_time: start_time, end_time: end_time});
        }
    }

    onClear() {
        // this.chosenCategory = null;
        this.dialogRef.close({start_time: '', end_time: ''});
    }

    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }
    
}