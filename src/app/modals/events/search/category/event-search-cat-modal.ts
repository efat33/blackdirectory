import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/events/event.service';

export interface DialogData {
    category: number,
    categories: any
}

@Component({
    selector: 'event-search-cat-modal',
    templateUrl: 'event-search-cat-modal.html',
    styleUrls: ['event-search-cat-modal.scss']
})

export class EventSearchCatModal implements OnInit {

    subscriptions = new Subscription();

    categories = [];

    chosenCategory: number = null;

    constructor(
        public dialogRef: MatDialogRef<EventSearchCatModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private eventService: EventService
    ) {
        
    }

    ngOnInit(): void {
       if(this.data.category != null){
           this.chosenCategory = this.data.category;
       }
       this.categories = this.data.categories;
    }

    onSubmit() {
        this.dialogRef.close();
    }

    onApply() {
        let selectedCat = null;
        if(this.chosenCategory != null){
            selectedCat = this.categories.find((category) => category.value == this.chosenCategory).viewValue;
        }
        this.dialogRef.close({value: this.chosenCategory, viewValue: selectedCat});
    }

    onClear() {
        this.chosenCategory = null;
        this.dialogRef.close({value: null, viewValue: null});
    }

    filteredListingCategories(searchString: any) {
        if (this.categories) {
          return this.categories.filter((category) => category.viewValue.toLowerCase().includes(searchString.toLowerCase()));
        }
    
        return [];
    }

    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }
    
}