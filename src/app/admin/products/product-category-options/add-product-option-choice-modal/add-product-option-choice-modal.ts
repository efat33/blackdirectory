import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'add-product-option-choice-modal',
  templateUrl: 'add-product-option-choice-modal.html',
  styleUrls: ['add-product-option-choice-modal.scss'],
})
export class AddProductOptionChoiceModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  productOptionChoiceForm: FormGroup;
  choice: any;
  option: any;

  constructor(
    private dialogRef: MatDialogRef<AddProductOptionChoiceModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.choice = this.data?.choice || {};
    this.option = this.data?.option;
  }

  ngOnInit(): void {
    this.productOptionChoiceForm = new FormGroup({
      option_id: new FormControl(this.option.id || '', Validators.required),
      title: new FormControl(this.choice.title || '', Validators.required),
      choice_order: new FormControl(this.choice.choice_order || '', Validators.required),
    });
  }

  onSubmit() {
    if (this.choice.id) {
      this.editCategoryOption();
    } else {
      this.addCategoryOption();
    }
  }

  addCategoryOption() {
    this.spinnerService.show();
    const subscription = this.productService.addOptionChoice(this.productOptionChoiceForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Choice added');
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
    const subscription = this.productService.editOptionChoice(this.choice.id, this.productOptionChoiceForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Choice updated');
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
