import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'add-product-category-modal',
  templateUrl: 'add-product-category-modal.html',
  styleUrls: ['add-product-category-modal.scss'],
})
export class AddProductCategoryModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  productCategoryForm: FormGroup;
  category: any = {};
  edit: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddProductCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.category = this.data?.category || {};
    this.edit = this.data?.edit || false;
  }

  ngOnInit(): void {
    this.productCategoryForm = new FormGroup({
      title: new FormControl(this.edit ? this.category.title || '' : '', Validators.required),
    });

    if (!this.edit) {
      this.productCategoryForm.addControl('parent_id', new FormControl(this.category.id || null));
    }
  }

  onSubmit() {
    if (this.edit) {
      this.editCategory();
    } else {
      this.addCategory();
    }
  }

  addCategory() {
    this.spinnerService.show();
    const subscription = this.productService.addCategory(this.productCategoryForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Category added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editCategory() {
    // this.spinnerService.show();
    const subscription = this.productService.editCategory(this.category.id, this.productCategoryForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Category updated');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
