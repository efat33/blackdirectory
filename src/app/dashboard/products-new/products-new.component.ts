import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { PostNewProductBody, ProductService, Tag } from 'src/app/shared/services/product.service';
import { Router } from '@angular/router';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-products-new',
  templateUrl: './products-new.component.html',
  styleUrls: ['./products-new.component.css'],
})
export class ProductsNewComponent implements OnInit {
  titleLimit: number = 80;
  shortDescriptionLimit: number = 200;

  productForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(this.titleLimit)]),
    price: new FormControl(0, Validators.required),
    discounted_price: new FormControl(0),
    discount_start: new FormControl(null),
    discount_end: new FormControl(null),
    categories: new FormArray([new FormControl(null, Validators.required)]),
    options: new FormArray([]),
    tags: new FormControl([]),
    image: new FormControl('', Validators.required),
    galleries: new FormArray([new FormControl('')]),
    short_desc: new FormControl('', Validators.maxLength(this.shortDescriptionLimit)),
    description: new FormControl('', Validators.required),
    sku: new FormControl(''),
    stock_status: new FormControl('', Validators.required),
    purchase_note: new FormControl(''),
    virtual: new FormControl(false),
    downloadable: new FormControl(false),
    download_files: new FormGroup({
      limit: new FormControl(null),
      expire_days: new FormControl(null),
      files: new FormArray([
        new FormGroup({
          name: new FormControl(''),
          file: new FormControl(''),
        }),
      ]),
    }),
    meta_title: new FormControl(''),
    meta_keywords: new FormControl(''),
    meta_desc: new FormControl(''),
  });
  ckEditor = DocumentEditor;
  ckConfig = {
    placeholder: 'Description',
    height: 200,
    toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList'],
  };

  // Tags autocomplete
  tagInput = new FormControl('');
  private allTags$: Observable<{ id: number; title: string }[]> = this.productService.getTags().pipe(take(1));
  tags$: Observable<{ id: number; title: string }[]> = (this.tagInput.valueChanges as Observable<string>).pipe(
    filter((value) => value != null && typeof value === 'string'),
    withLatestFrom(this.allTags$),
    map(([userInput, tags]) => tags.filter((tag) => tag.title.includes(userInput.toLowerCase())))
  );

  // Show error if any
  showError = false;
  errorMessage = '';

  get galleries(): FormArray {
    return this.productForm.get('galleries') as FormArray;
  }
  get files(): FormArray {
    return this.productForm.get('download_files.files') as FormArray;
  }
  get fileName(): string {
    return this.productForm.controls.download_files.get('files').value;
  }

  get selectedTags(): { title: string; id: number }[] {
    return this.productForm.controls.tags.value;
  }

  get isDownloadable(): boolean {
    return this.productForm.controls.downloadable.value;
  }

  get categoryFormArray(): FormArray {
    return this.productForm.get('categories') as FormArray;
  }

  get optionFormArray(): FormArray {
    return this.productForm.get('options') as FormArray;
  }
  routePathStart: string = '';

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routePathStart = `/${this.router.url.split('/')[1]}`;

    // Remove extra gallery inputs, add one more if all filled
    this.galleries.valueChanges.subscribe(this.arrangeGalleryInputCount);
  }

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

  addFile(file: string, filename: string): any {
    this.files.push(
      new FormGroup({
        name: new FormControl(file),
        file: new FormControl(filename),
      })
    );
  }

  removeFile(index: number): void {
    this.files.removeAt(index);
  }

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
  }

  arrangeGalleryInputCount = (galleries: string[]): void => {
    let i = 0;
    while (i < galleries.length - 1) {
      const gallery = galleries[i];
      if (gallery === '') {
        galleries.splice(i, 1);
        this.galleries.removeAt(i);
      } else {
        i++;
      }
    }
    if (galleries.every((gallery) => gallery !== '') && galleries.length < 5) {
      this.galleries.push(new FormControl(''));
    }
  };

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.spinnerService.show();
    const pf: {
      title: string;
      price: number;
      discounted_price?: number;
      discount_start: Date | null;
      discount_end: Date | null;
      categories: number[];
      options: {
        label: string;
        option_id: number;
        choices: {
          label: string;
          id: number;
          checked: boolean;
        }[];
      }[];
      tags: Tag[];
      image: string;
      galleries: string[];
      short_desc?: string;
      description: string;
      sku: string;
      stock_status: 'instock' | 'outstock' | 'backorder';
      purchase_note: string;
      virtual: boolean;
      downloadable: boolean;
      download_files: {
        limit?: number | null;
        expire_days?: number | null;
        files: { name: string; file: string }[];
      };
      meta_title: string;
      meta_keywords: string;
      meta_desc: string;
    } = this.productForm.value;

    const form: PostNewProductBody = {
      ...pf,
      options: pf.options
        .map((opt) => ({
          option_id: opt.option_id,
          choices: opt.choices.filter((c) => c.checked).map((c) => c.id),
        }))
        .filter((opt) => opt.choices.length > 0),
      galleries: pf.galleries.filter((image) => image !== ''),
      categories: pf.categories.filter((c) => c != null),
      tags: pf.tags.map((tag) => tag.id),
      is_virtual: pf.virtual ? 1 : 0,
      is_downloadable: pf.downloadable ? 1 : 0,
      discounted_price: pf.discounted_price > 0 ? pf.discounted_price : null,
    };
    this.productService.postNewProduct(form).subscribe(
      (res) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message);

        setTimeout(() => {
          this.router.navigate([`/${this.routePathStart}`, 'products']);
        }, 2000);
      },
      (error) => {
        this.showError = true;
        this.errorMessage = error.message;
        console.log(error);
      }
    );
  }
}
