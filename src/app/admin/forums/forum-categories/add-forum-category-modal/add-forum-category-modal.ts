import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { EventService } from 'src/app/events/event.service';
import { ForumService } from 'src/app/forums/forum.service';

@Component({
  selector: 'add-forum-category-modal',
  templateUrl: 'add-forum-category-modal.html',
  styleUrls: ['add-forum-category-modal.scss'],
})
export class AddForumCategoryModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  forumCategoryForm: FormGroup;
  category: any = {};

  constructor(
    private dialogRef: MatDialogRef<AddForumCategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private eventService: EventService,
    private forumService: ForumService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.category = this.data?.category || {};
  }

  ngOnInit(): void {
    this.forumCategoryForm = new FormGroup({
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
    const subscription = this.forumService.addCategory(this.forumCategoryForm.value).subscribe(
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
    const subscription = this.forumService.updateCategory(this.category.id, this.forumCategoryForm.value).subscribe(
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
