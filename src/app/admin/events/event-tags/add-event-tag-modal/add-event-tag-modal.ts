import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { EventService } from 'src/app/events/event.service';

@Component({
  selector: 'add-event-tag-modal',
  templateUrl: 'add-event-tag-modal.html',
  styleUrls: ['add-event-tag-modal.scss'],
})
export class AddEventTagModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  eventTagForm: FormGroup;
  tag: any = {};

  constructor(
    private dialogRef: MatDialogRef<AddEventTagModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.tag = this.data?.tag || {};
  }

  ngOnInit(): void {
    this.eventTagForm = new FormGroup({
      title: new FormControl(this.tag.title || '', Validators.required)
    });
  }

  onSubmit() {
    if (this.tag.id) {
      this.editTag();
    } else {
      this.addTag();
    }
  }

  addTag() {
    this.spinnerService.show();
    const subscription = this.eventService.addTag(this.eventTagForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Tag added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editTag() {
    this.spinnerService.show();
    const subscription = this.eventService.updateTag(this.tag.id, this.eventTagForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Tag updated');
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
