import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { EventService } from 'src/app/events/event.service';

@Component({
  selector: 'add-event-organizer-modal',
  templateUrl: 'add-event-organizer-modal.html',
  styleUrls: ['add-event-organizer-modal.scss'],
})
export class AddEventOrganizerModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  eventOrganizerForm: FormGroup;
  organizer: any = {};

  constructor(
    private dialogRef: MatDialogRef<AddEventOrganizerModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.organizer = this.data?.organizer || {};
  }

  ngOnInit(): void {
    this.eventOrganizerForm = new FormGroup({
      name: new FormControl(this.organizer.name || '', Validators.required),
      phone: new FormControl(this.organizer.phone || '', Validators.required),
      website: new FormControl(this.organizer.website || ''),
      email: new FormControl(this.organizer.email || '', Validators.email),
    });
  }

  onSubmit() {
    if (this.organizer.id) {
      this.editOrganizer();
    } else {
      this.addOrganizer();
    }
  }

  addOrganizer() {
    this.spinnerService.show();
    const subscription = this.eventService.newOrganiser(this.eventOrganizerForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Organizer added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editOrganizer() {
    this.spinnerService.show();
    const subscription = this.eventService.updateOrganizer(this.organizer.id, this.eventOrganizerForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Organizer updated');
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
