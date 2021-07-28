import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
    coupon: any;
}

@Component({
    selector: 'coupon-modal',
    templateUrl: 'coupon-modal.html',
    styleUrls: ['coupon-modal.scss']
})

export class CouponModal implements OnInit {

    coupon: any;

    constructor(
        public dialogRef: MatDialogRef<CouponModal>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.coupon = this.data.coupon;
    }

    
    
}