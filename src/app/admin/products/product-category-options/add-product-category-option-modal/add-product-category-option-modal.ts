import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'add-product-category-option-modal',
  templateUrl: 'add-product-category-option-modal.html',
  styleUrls: ['add-product-category-option-modal.scss'],
})
export class AddProductCategoryOptionModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  productCategoryOptionForm: FormGroup;
  option: any;

  constructor(
    private dialogRef: MatDialogRef<AddProductCategoryOptionModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.option = this.data?.option || {};
  }

  ngOnInit(): void {
    this.productCategoryOptionForm = new FormGroup({
      title: new FormControl(this.option.title || '', Validators.required),
    });
  }

  onSubmit() {
    if (this.option.id) {
      this.editCategoryOption();
    } else {
      this.addCategoryOption();
    }
  }

  addCategoryOption() {
    this.spinnerService.show();
    const subscription = this.productService.addCategoryOption(this.productCategoryOptionForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Option added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editCategoryOption() {
    this.spinnerService.show();
    const subscription = this.productService.editCategoryOption(this.option.id, this.productCategoryOptionForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Option updated');
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
