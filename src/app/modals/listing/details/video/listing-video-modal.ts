import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';

export interface DialogData {
    index: number;
    videos: any;
}

@Component({
    selector: 'listing-video-modal',
    templateUrl: 'listing-video-modal.html',
    styleUrls: ['listing-video-modal.scss']
})

export class ListingVideoModal implements OnInit {

  video: any;
  videoUrl: SafeResourceUrl;


  constructor(
      public dialogRef: MatDialogRef<ListingVideoModal>,
      private helperservice: HelperService,
      public sanitizer:DomSanitizer,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
      
  }

  ngOnInit(): void {
    this.video = this.data.videos[this.data.index];

    const url_arr = this.video.url.split('?v=');

    let video_id = '';
    if(url_arr.length == 2){
      video_id = url_arr[1].replace('/', '');
    }

    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/'+video_id+'?autoplay=1'); 
    // console.log(this.videoUrl);
  }

    

    
}