import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, pluck, take, withLatestFrom } from 'rxjs/operators';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { PostEditProductBody, ProductDetails, ProductService, Tag } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.css'],
})
export class ProductsEditComponent implements OnInit {
  currentValues: ProductDetails;
  productForm = new FormGroup({
    id: new FormControl(null, Validators.required),
    title: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    discounted_price: new FormControl(0),
    discount_start: new FormControl(null),
    discount_end: new FormControl(null),
    categories: new FormArray([new FormControl(null, Validators.required)]),
    options: new FormArray([]),
    tags: new FormControl([]),
    image: new FormControl('', Validators.required),
    galleries: new FormArray([new FormControl('')]),
    short_desc: new FormControl(''),
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
  });

  // Tags autocomplete
  tagInput = new FormControl('');
  private allTags$: Observable<Tag[]> = this.productService.getTags().pipe(take(1));
  tags$: Observable<Tag[]> = (this.tagInput.valueChanges as Observable<string>).pipe(
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

  get selectedTags(): Tag[] {
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
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routePathStart = `/${this.router.url.split('/')[1]}`;

    // Remove extra gallery inputs, add one more if all filled
    this.galleries.valueChanges.subscribe(this.arrangeGalleryInputCount);

    this.activatedRoute.data.pipe(pluck<Data, ProductDetails>('product')).subscribe((p) => {
      this.currentValues = p;
      this.productForm.patchValue({
        ...p,
        tags: p.tags,
        virtual: p.is_virtual,
        downloadable: p.is_downloadable,
        categories: [],
      });
      this.galleries.patchValue(p.galleries);
    });
  }

  addTag(tag: Tag): void {
    const tags = this.selectedTags;
    if (!tags.includes(tag)) {
      tags.push(tag);
      this.productForm.controls.tags.setValue(tags);
    }
    this.tagInput.setValue('');
  }

  removeTag(tag: Tag): void {
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
    if (galleries.every((gallery) => gallery !== '')) {
      this.galleries.push(new FormControl(''));
    }
  };

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.spinnerService.show();
    const pf: {
      id: number;
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
    } = this.productForm.value;

    const form: PostEditProductBody = {
      ...pf,
      options: pf.options
        .map((opt) => ({
          option_id: opt.option_id,
          choices: opt.choices.filter((c) => c.checked).map((c) => c.id),
        }))
        .filter((opt) => opt.choices.length > 0),
      galleries: pf.galleries.filter((image) => image !== ''),
      tags: pf.tags.map((tag) => tag.id),
      categories: pf.categories.filter((c) => c != null),
      is_virtual: pf.virtual ? 1 : 0,
      is_downloadable: pf.downloadable ? 1 : 0,
      discounted_price: pf.discounted_price > 0 ? pf.discounted_price : null,
    };
    this.productService.postEditProduct(form).subscribe(
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
