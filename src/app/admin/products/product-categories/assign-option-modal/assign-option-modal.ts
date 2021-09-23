import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'assign-option-modal',
  templateUrl: 'assign-option-modal.html',
  styleUrls: ['assign-option-modal.scss'],
})
export class AssignCategoryOptionsModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  categoryOptionsForm: FormGroup;
  category: any = {};

  options: any = [];

  constructor(
    private dialogRef: MatDialogRef<AssignCategoryOptionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private fb: FormBuilder
  ) {
    this.category = this.data?.category || {};
  }

  ngOnInit(): void {
    this.categoryOptionsForm = this.fb.group({
      options: this.fb.array([]),
    });

    this.getOptions();
  }

  getOptions() {
    this.spinnerService.show();
    const subscription = this.productService.getCategoryOptions().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.options = result.data;

        const formArray = this.categoryOptionsForm.get('options') as FormArray;

        for (const option of this.options) {
          const optionSelected = this.category.optionsArray.find((op: any) => op.id === option.id);
          formArray.push(new FormControl(!!optionSelected));
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  onSubmit() {
    const selectedOptions = Object.assign({}, this.categoryOptionsForm.value, {
      options: this.options.filter((x, i) => !!this.categoryOptionsForm.value.options[i]),
    });

    const body = {
      selectedOptions: selectedOptions.options,
      category_id: this.category.id
    };

    this.spinnerService.show();
    const subscription = this.productService.assignCategoryOptions(body).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Options updated');
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
