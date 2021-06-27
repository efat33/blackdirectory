import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

export interface DialogData {
    portfolio: any;
    edit: boolean;
}

@Component({
    selector: 'candidate-portfolio-modal',
    templateUrl: 'candidate-portfolio-modal.html',
    styleUrls: ['candidate-portfolio-modal.scss']
})

export class CandidatePortfolioModal implements OnInit {

    portfolioForm: FormGroup;
    showError = false;
    errorMessage = '';
    portfolioImageSrc: string;
    progressImage:number = 0;

    formCustomvalidation = {
      image: {
        validated: true,
        message: ''
      }
    };

    constructor(
        public dialogRef: MatDialogRef<CandidatePortfolioModal>, 
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private helperservice: HelperService,
        private uploadService: UploadService,
    ) {
        
    }

    ngOnInit(): void {
      let image_src = '';
      if(this.data.portfolio?.image_name && this.data.portfolio?.image_name != ''){
        image_src = this.helperservice.getImageUrl(this.data.portfolio.image_name, 'users', 'medium');
        this.portfolioImageSrc = image_src;
      }
      this.portfolioForm = new FormGroup({
        title: new FormControl(this.data.portfolio?.title || '', Validators.required),
        image: new FormControl(''),
        image_name: new FormControl(this.data.portfolio?.image_name || '', Validators.required),
        image_src: new FormControl(image_src || ''),
        youtube_url: new FormControl(this.data.portfolio?.youtube_url || ''),
        site_url: new FormControl(this.data.portfolio?.site_url || ''),
        id: new FormControl(this.data.portfolio?.id || ''),
      });
    }

    onSubmit() {
        this.dialogRef.close(this.portfolioForm.value);
    }

    onPortfolioImageChange(event) {
      // reset validation
      this.formCustomvalidation.image.validated = true;
      this.formCustomvalidation.image.message = '';

      const reader = new FileReader();
      
      if(event.target.files && event.target.files.length) {
        const file = event.target.files[0];

        // do validation
        const res = this.helperservice.imageValidation(file);
        if(!res.validated) {
          this.formCustomvalidation.image.validated = false;
          this.formCustomvalidation.image.message = res.message;
          return;
        }
        
        this.portfolioImageSrc = URL.createObjectURL(file);
        
        // send image to the server
        const fd = new FormData();
        fd.append("image", file, file.name);
        fd.append("resize", 'yes');

        this.uploadService.uploadImage(fd, 'user').subscribe((event: HttpEvent<any>) => {
          
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progressImage = Math.round(event.loaded / event.total * 100);
              break;
            case HttpEventType.Response:

            // check for validation
            if(event.body.data.fileValidationError){
              this.formCustomvalidation.image.validated = false;
              this.formCustomvalidation.image.message = event.body.data.fileValidationError;
            }
            else{
              this.portfolioForm.get('image_name').patchValue(event.body.data.filename);
              this.portfolioForm.get('image_src').patchValue(this.helperservice.getImageUrl(event.body.data.filename, 'users', 'medium'));
            }

            // hide progress bar
            setTimeout(() => {
              this.progressImage = 0;
            }, 1500);
          }

        });
    
      }
    }
    
}