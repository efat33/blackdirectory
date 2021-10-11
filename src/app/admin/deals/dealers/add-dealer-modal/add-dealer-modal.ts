import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewsService } from 'src/app/news/news.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { DealsService } from 'src/app/deals/deals.service';

@Component({
  selector: 'add-dealer-modal',
  templateUrl: 'add-dealer-modal.html',
  styleUrls: ['add-dealer-modal.scss'],
})
export class AddDealerModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  dealerForm: FormGroup;
  dealer: any = {};

  constructor(
    private dialogRef: MatDialogRef<AddDealerModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dealsService: DealsService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.dealer = this.data?.dealer || {};
  }

  ngOnInit(): void {
    this.dealerForm = new FormGroup({
      name: new FormControl(this.dealer.name || '', Validators.required)
    });
  }

  onSubmit() {
    if (this.dealer.id) {
      this.editDealer();
    } else {
      this.addDealer();
    }
  }

  addDealer() {
    this.spinnerService.show();
    const subscription = this.dealsService.addDealer(this.dealerForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Dealer added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editDealer() {
    this.spinnerService.show();
    const subscription = this.dealsService.updateDealer(this.dealer.id, this.dealerForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('Dealer updated');
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
