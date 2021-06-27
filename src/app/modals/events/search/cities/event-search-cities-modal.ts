import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    option: number;
}

@Component({
    selector: 'event-search-cities-modal',
    templateUrl: 'event-search-cities-modal.html',
    styleUrls: ['event-search-cities-modal.scss']
})

export class EventSearchCityModal implements OnInit {

    options = [
        { value: 1, viewValue: 'Books'},
        { value: 2, viewValue: 'Business'},
        { value: 3, viewValue: 'Comedy'},
        { value: 4, viewValue: 'Film & Media'},
        { value: 5, viewValue: 'General Discussion'},
        { value: 6, viewValue: 'Hobbies'},
    ];

    chosenOption: number = null;

    constructor(
        public dialogRef: MatDialogRef<EventSearchCityModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
       if(this.data.option != null){
           this.chosenOption = this.data.option;
       }
    }

    onSubmit() {
        this.dialogRef.close();
    }

    onApply() {
        let selectedOption = null;
        if(this.chosenOption != null){
            selectedOption = this.options.find((option) => option.value == this.chosenOption).viewValue;
        }
        this.dialogRef.close({value: this.chosenOption, viewValue: selectedOption});
    }

    onClear() {
        this.chosenOption = null;
        this.dialogRef.close({value: null, viewValue: null});
    }

    filteredRadioOptions(searchString: any) {
        if (this.options) {
          return this.options.filter((option) => option.viewValue.toLowerCase().includes(searchString.toLowerCase()));
        }
    
        return [];
    }
    
}