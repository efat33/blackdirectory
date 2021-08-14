import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HelperService } from '../../helper.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.css'],
})
export class ImageInputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() uploadDirectory: string;
  @Input() text: string = '';
  file = null;
  fileStr = '';
  showDelete = false;

  progress: number = 0;
  validation = {
    validated: true,
    message: '',
  };

  constructor(private helperService: HelperService, private uploadService: UploadService) {}

  ngOnInit(): void {
    const preload = this.control.value;
    if (preload) {
      this.file = {};
      this.fileStr = this.helperService.getImageUrl(preload, this.uploadDirectory);
    }
  }

  onFileDropped(file: any): void {
    this.preview(file as File);
  }

  onImageChange(e) {
    let file: File = null;
    if (e.target.files && e.target.files.length) {
      [file] = e.target.files;
      this.preview(file);
    }

    // reset validation
    this.validation.validated = true;
    this.validation.message = '';

    if (file) {
      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.deleteImage();
        this.validation.validated = false;
        this.validation.message = res.message;
        return;
      }

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, this.uploadDirectory).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.validation.validated = false;
              this.validation.message = event.body.data.fileValidationError;
            } else {
              this.control.patchValue(event.body.data.filename);
            }
            // hide progress bar
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
        }
      });
    }
  }

  preview(file: File): void {
    const reader = new FileReader();
    this.file = file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.fileStr = reader.result as string;
      this.showDelete = false;
    };
  }

  deleteImage() {
    this.file = null;
    this.fileStr = '';
    this.control.patchValue('');
  }
}
