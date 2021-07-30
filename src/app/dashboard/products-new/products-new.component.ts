import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
    category: new FormControl(null),
    tags: new FormControl([]),
    image: new FormControl(null),
    galleries: new FormControl([]),
    short_desc: new FormControl(''),
    description: new FormControl(''),
    sku: new FormControl(''),
    stock_management_enabled: new FormControl(false),
    stock_status: new FormControl(''),
    stock_quantity: new FormControl(0),
    purchase_note: new FormControl(''),
    virtual: new FormControl(false),
    downloadable: new FormControl(false),
    file_name: new FormControl(''),
    file: new FormControl(null),
  });

  // Category autocomplete
  categoryInput = new FormControl('');
  categories$: Observable<string[]> = this.categoryInput.valueChanges.pipe(
    mergeMap(() => {
      return of(['Category 1', 'Category 2', 'Category 3', 'Category 4']);
    })
  );

  // Tags autocomplete
  tagInput = new FormControl('');
  tags$: Observable<string[]> = this.tagInput.valueChanges.pipe(
    mergeMap(() => {
      return of(['Tag 1', 'Tag 2']);
    })
  );

  // Show error if any
  showError = false;
  errorMessage = '';

  // File upload
  progressFile: number = 0;
  formCustomvalidation = {
    file: {
      validated: true,
      message: '',
    },
  };
  get fileName(): string {
    return this.productForm.controls.file_name.value;
  }

  get selectedTags(): string[] {
    return this.productForm.controls.tags.value;
  }

  get isStockManagementEnabled(): boolean {
    return this.productForm.controls.stock_management_enabled.value;
  }

  get isDownloadable(): boolean {
    return this.productForm.controls.downloadable.value;
  }

  constructor(private helperService: HelperService, private uploadService: UploadService) {}

  ngOnInit(): void {}

  selectCategory(category: string): void {
    this.productForm.controls.category.setValue(category);
  }

  checkCategory(): void {
    const selectedCategory = this.productForm.controls.category.value;
    if (!selectedCategory || selectedCategory !== this.categoryInput.value) {
      this.categoryInput.setValue('');
    }
  }

  addTag(tag: string): void {
    const tags = this.selectedTags;
    if (!tags.includes(tag)) {
      tags.push(tag);
      this.productForm.controls.tags.setValue(tags);
      this.tagInput.setValue('');
    }
  }

  removeTag(tag: string): void {
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

      this.uploadService.uploadFile(fd, 'user').subscribe(
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

  onSubmit(): void {
    console.log(this.productForm.value);
  }
}
