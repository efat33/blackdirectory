import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface DialogData {
    category: number,
    categories: any
}

@Component({
    selector: 'listing-search-cat-modal',
    templateUrl: 'listing-search-cat-modal.html',
    styleUrls: ['listing-search-cat-modal.scss']
})

export class ListingSearchCatModal implements OnInit {

    subscriptions = new Subscription();

    categories = [
        // { value: 1, viewValue: 'Accommodation'},
        // { value: 2, viewValue: 'Accountants'},
        // { value: 3, viewValue: 'Energy Healing'},
        // { value: 4, viewValue: 'Estate Agents'},
        // { value: 5, viewValue: 'Food & Drink'},
        // { value: 6, viewValue: 'Restaurants'},
    ];

    chosenCategory: number = null;

    constructor(
        public dialogRef: MatDialogRef<ListingSearchCatModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
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
    
}