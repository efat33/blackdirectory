import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { HelperService } from 'src/app/shared/helper.service';

export interface DialogData {
    index: number;
    galleries: string;
}

@Component({
    selector: 'listing-gallery-modal',
    templateUrl: 'listing-gallery-modal.html',
    styleUrls: ['listing-gallery-modal.scss']
})

export class ListingGalleryModal implements OnInit {

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[] = [];


    constructor(
        public dialogRef: MatDialogRef<ListingGalleryModal>,
        private helperservice: HelperService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        
    }

    ngOnInit(): void {
        this.initiateGallery();
        this.populateGallery();
    }

    populateGallery() {
      if(!this.data.galleries) return;
  
      const galleries = JSON.parse(this.data.galleries);
  
      for (const item of galleries) {
        const obj = {
          small: this.helperservice.getImageUrl(item, 'listing', 'thumb'),
          medium: this.helperservice.getImageUrl(item, 'listing', 'medium'),
          big: this.helperservice.getImageUrl(item, 'listing')
        }
  
        this.galleryImages.push(obj);
      }
    }
  
    initiateGallery() {
      this.galleryOptions = [
        {
            width: '800px',
            height: '600px',
            thumbnailsColumns: 4,
            imageAnimation: NgxGalleryAnimation.Slide,
            preview: false,
            startIndex: this.data.index
        },
        // max-width 800
        {
            breakpoint: 800,
            width: '100%',
            height: '600px',
            imagePercent: 80,
            thumbnailsPercent: 20,
            thumbnailsMargin: 20,
            thumbnailMargin: 20,
            preview: false
        },
        // max-width 400
        {
            breakpoint: 400,
            preview: false
        }
      ];
    }

    
}