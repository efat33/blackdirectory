import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    option: number;
    options: any;
}

@Component({
    selector: 'event-search-organizers-modal',
    templateUrl: 'event-search-organizers-modal.html',
    styleUrls: ['event-search-organizers-modal.scss']
})

export class EventSearchOrganizersModal implements OnInit {

    options = [];

    chosenOption: number = null;

    constructor(
        public dialogRef: MatDialogRef<EventSearchOrganizersModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
       if(this.data.option != null){
           this.chosenOption = this.data.option;
       }
       this.options = this.data.options;
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