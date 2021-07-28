import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewsService } from 'src/app/news/news.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'add-news-category-modal',
  templateUrl: 'add-news-category-modal.html',
  styleUrls: ['add-news-category-modal.scss'],
})
export class AddNewsCategoryModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  newsCategoryForm: FormGroup;
  category: any = {};

  constructor(
    private dialogRef: MatDialogRef<AddNewsCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private newsService: NewsService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.category = this.data?.category || {};
  }

  ngOnInit(): void {
    this.newsCategoryForm = new FormGroup({
      name: new FormControl(this.category.name || '', Validators.required),
      category_order: new FormControl(this.category.category_order || '', [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  onSubmit() {
    if (this.category.id) {
      this.editCategory();
    } else {
      this.addCategory();
    }
  }

  addCategory() {
    this.spinnerService.show();
    const subscription = this.newsService.addNewsCategory(this.newsCategoryForm.value).subscribe(
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
    this.spinnerService.show();
    const subscription = this.newsService.updateNewsCategory(this.category.id, this.newsCategoryForm.value).subscribe(
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
