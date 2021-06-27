import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
    price: string;
}

@Component({
    selector: 'listing-search-price-modal',
    templateUrl: 'listing-search-price-modal.html',
    styleUrls: ['listing-search-price-modal.scss']
})

export class ListingSearchPriceModal implements OnInit {

    prices = [
        { value: 'nottosay', viewValue: 'Not to say'},
        { value: 'cheap', viewValue: 'Cheap'},
        { value: 'moderate', viewValue: 'Moderate'},
        { value: 'expensive', viewValue: 'Expensive'},
        { value: 'ultra_high', viewValue: 'Ultra High'}
    ];

    chosenPrice: string = null;

    constructor(
        public dialogRef: MatDialogRef<ListingSearchPriceModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
       if(this.data.price != null){
           this.chosenPrice = this.data.price;
       }
    }

    onSubmit() {
        this.dialogRef.close();
    }

    onApply() {
        let selectedPrice = null;
        if(this.chosenPrice != null){
            selectedPrice = this.prices.find((price) => price.value == this.chosenPrice).viewValue;
        }
        this.dialogRef.close({value: this.chosenPrice, viewValue: selectedPrice});
    }

    onClear() {
        this.chosenPrice = null;
        this.dialogRef.close({value: null, viewValue: null});
    }

    
}