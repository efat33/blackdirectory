import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, mergeMapTo, pluck, take, tap, withLatestFrom, startWith } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-products-new',
  templateUrl: './products-new.component.html',
  styleUrls: ['./products-new.component.css'],
})
export class ProductsNewComponent implements OnInit {
  productForm = new FormGroup({
    title: new FormControl(''),
    price: new FormControl(0),
    discounted_price: new FormControl(0),
    discount_start: new FormControl(null),
    discount_end: new FormControl(null),
    category_id: new FormControl(null),
    tags: new FormControl([]),
    image: new FormControl(null),
    galleries: new FormControl([]),
    short_desc: new FormControl(''),
    description: new FormControl(''),
    sku: new FormControl(''),
    stock_status: new FormControl(''),
    purchase_note: new FormControl(''),
    virtual: new FormControl(false),
    downloadable: new FormControl(false),
    file_name: new FormControl(''),
    file: new FormControl(null),
  });

  categories$: Observable<{ id: number; title: string }[]> = this.helperService.getCategories();

  // Tags autocomplete
  tagInput = new FormControl('');
  private allTags$: Observable<{ id: number; title: string }[]> = this.helperService.getTags().pipe(take(1));
  tags$: Observable<{ id: number; title: string }[]> = (this.tagInput.valueChanges as Observable<string>).pipe(
    filter((value) => value != null && typeof value === 'string'),
    withLatestFrom(this.allTags$),
    map(([userInput, tags]) => tags.filter((tag) => tag.title.includes(userInput.toLowerCase())))
  );

  // Show error if any
  showError = false;
  errorMessage = '';

  // File upload
  progressFile: number = 0;
  progressFeaturedImage: number = 0;
  formCustomvalidation = {
    file: {
      validated: true,
      message: '',
    },
    featuredImage: {
      validated: true,
      message: '',
    },
  };
  get fileName(): string {
    return this.productForm.controls.file_name.value;
  }

  get selectedTags(): { title: string; id: number }[] {
    return this.productForm.controls.tags.value;
  }

  get gallery(): File[] {
    return this.productForm.controls.galleries.value;
  }
  get galleryArr(): File[] {
    return [...this.gallery, null];
  }

  get isDownloadable(): boolean {
    return this.productForm.controls.downloadable.value;
  }

  constructor(private helperService: HelperService, private uploadService: UploadService) {}

  ngOnInit(): void {}

  addTag(tag: { title: string; id: number }): void {
    const tags = this.selectedTags;
    if (!tags.includes(tag)) {
      tags.push(tag);
      this.productForm.controls.tags.setValue(tags);
    }
    this.tagInput.setValue('');
  }

  removeTag(tag: { title: string; id: number }): void {
    const tags = this.selectedTags;
    const newTags = tags.filter((t) => t !== tag);
    this.productForm.controls.tags.setValue(newTags);
  }

  onFileChange(fileEvent) {
    // reset validation
    this.formCustomvalidation.file.validated = true;
    this.formCustomvalidation.file.message = '';

    if (fileEvent.target.files && fileEvent.target.files.length) {
      const file = fileEvent.target.files[0];

      // do validation
      const res = this.helperService.fileValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.file.validated = false;
        this.formCustomvalidation.file.message = res.message;
        return;
      }

      // send image to the server
      const fd = new FormData();
      fd.append('file', file, file.name);

      this.uploadService.uploadFile(fd, 'product').subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progressFile = Math.round((event.loaded / event.total) * 100);
              break;
            case HttpEventType.Response:
              // check for validation
              if (event.body.data.fileValidationError) {
                this.formCustomvalidation.file.validated = false;
                this.formCustomvalidation.file.message = event.body.data.fileValidationError;
              } else {
                this.productForm.get('file_name').patchValue(event.body.data.filename);
              }

              // hide progress bar
              setTimeout(() => {
                this.progressFile = 0;
              }, 1500);
          }
        },
        (uploadRes: any) => {
          console.log(uploadRes);
        }
      );
    }
  }

  galleryImageChange(index: number, file: File): void {
    console.log(index, file);
    if (index === this.gallery.length) {
      this.addGalleryImage(file);
    } else {
      this.removeGalleryImage(index);
    }
  }

  onFeaturedImageChange(file: File | null) {
    // reset validation
    this.formCustomvalidation.featuredImage.validated = true;
    this.formCustomvalidation.featuredImage.message = '';

    if (file) {
      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.featuredImage.validated = false;
        this.formCustomvalidation.featuredImage.message = res.message;
        return;
      }

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'product').subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressFeaturedImage = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (event.body.data.fileValidationError) {
              this.formCustomvalidation.featuredImage.validated = false;
              this.formCustomvalidation.featuredImage.message = event.body.data.fileValidationError;
            } else {
              this.productForm.get('image').patchValue(event.body.data.filename);
            }
            // hide progress bar
            setTimeout(() => {
              this.progressFeaturedImage = 0;
            }, 1500);
        }
      });
    }
  }

  trackByIdentity = (index: number, item: any) => index;

  addGalleryImage(file: File): void {
    const galleries: File[] = this.gallery;
    galleries.push(file);
    this.productForm.controls.galleries.setValue(galleries);
    console.log(this.galleryArr);
  }

  removeGalleryImage(index: number): void {
    const galleries: File[] = this.gallery;
    galleries.splice(index, 1);
    this.productForm.controls.galleries.setValue(galleries);
    console.log(this.galleryArr);
  }

  onSubmit(): void {
    console.log(this.productForm.value);
  }
}
