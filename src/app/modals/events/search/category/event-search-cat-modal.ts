import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    category: number;
}

@Component({
    selector: 'event-search-cat-modal',
    templateUrl: 'event-search-cat-modal.html',
    styleUrls: ['event-search-cat-modal.scss']
})

export class EventSearchCatModal implements OnInit {

    categories = [
        { value: 1, viewValue: 'Books'},
        { value: 2, viewValue: 'Business'},
        { value: 3, viewValue: 'Comedy'},
        { value: 4, viewValue: 'Film & Media'},
        { value: 5, viewValue: 'General Discussion'},
        { value: 6, viewValue: 'Hobbies'},
    ];

    chosenCategory: number = null;

    constructor(
        public dialogRef: MatDialogRef<EventSearchCatModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
       if(this.data.category != null){
           this.chosenCategory = this.data.category;
       }
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
    
}