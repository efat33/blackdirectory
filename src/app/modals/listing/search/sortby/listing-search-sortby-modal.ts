import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    sortby: string;
}

@Component({
    selector: 'listing-search-sortby-modal',
    templateUrl: 'listing-search-sortby-modal.html',
    styleUrls: ['listing-search-sortby-modal.scss']
})

export class ListingSearchSortModal implements OnInit {

    sortbys = [
        { value: 'desc', viewValue: 'Descending'},
        { value: 'asc', viewValue: 'Ascending'}
    ];

    chosenSort: string = null;

    constructor(
        public dialogRef: MatDialogRef<ListingSearchSortModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
       if(this.data.sortby != null){
           this.chosenSort = this.data.sortby;
       }
    }

    onSubmit() {
        this.dialogRef.close();
    }

    onApply() {
        let selectedSort = null;
        if(this.chosenSort != null){
            selectedSort = this.sortbys.find((sortby) => sortby.value == this.chosenSort).viewValue;
        }
        this.dialogRef.close({value: this.chosenSort, viewValue: selectedSort});
    }

    onClear() {
        this.chosenSort = null;
        this.dialogRef.close({value: null, viewValue: null});
    }

    
}