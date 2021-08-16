import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css'],
})
export class FileInputComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() uploadDirectory: string;

  progress: number = 0;
  validation = {
    validated: true,
    message: '',
  };

  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {}

  onFileChange(fileEvent) {
    // reset validation
    this.validation.validated = true;
    this.validation.message = '';

    if (fileEvent.target.files && fileEvent.target.files.length) {
      const file = fileEvent.target.files[0];

      // send image to the server
      const fd = new FormData();
      fd.append('file', file, file.name);

      this.uploadService.uploadFile(fd, this.uploadDirectory).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progress = Math.round((event.loaded / event.total) * 100);
              break;
            case HttpEventType.ResponseHeader:
              if (!event.ok) {
                this.validation.validated = false;
                this.validation.message = 'An error occured, please try again.';
              }
              // hide progress bar
              setTimeout(() => {
                this.progress = 0;
              }, 1500);
              break;
            case HttpEventType.Response:
              // check for validation
              if (event.body.data.fileValidationError) {
                this.validation.validated = false;
                this.validation.message = event.body.data.fileValidationError;
              } else {
                this.form.get('file').patchValue(event.body.data.filename);
              }
              // hide progress bar
              setTimeout(() => {
                this.progress = 0;
              }, 1500);
          }
        },
        (uploadRes: any) => {
          console.log(uploadRes);
        }
      );
    }
  }
}
