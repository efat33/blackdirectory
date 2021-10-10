import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { EventService } from 'src/app/events/event.service';

@Component({
  selector: 'add-event-category-modal',
  templateUrl: 'add-event-category-modal.html',
  styleUrls: ['add-event-category-modal.scss'],
})
export class AddEventCategoryModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  eventCategoryForm: FormGroup;
  category: any = {};

  constructor(
    private dialogRef: MatDialogRef<AddEventCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.category = this.data?.category || {};
  }

  ngOnInit(): void {
    this.eventCategoryForm = new FormGroup({
      title: new FormControl(this.category.title || '', Validators.required),
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
    const subscription = this.eventService.addCategory(this.eventCategoryForm.value).subscribe(
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
    const subscription = this.eventService.updateCategory(this.category.id, this.eventCategoryForm.value).subscribe(
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
