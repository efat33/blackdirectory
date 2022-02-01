import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Country, PostStoreSettingsBody, StoreService } from 'src/app/shared/services/store.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

interface AddressParams {
  street: string;
  street_2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss'],
})
export class PaymentSettingsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  paymentForm = new FormGroup({
    account_name: new FormControl('', [Validators.required]),
    account_number: new FormControl('', [Validators.required]),
    bank_name: new FormControl('', [Validators.required]),
    bank_address: new FormControl(''),
    routing_number: new FormControl(''),
    iban: new FormControl(''),
    swift_code: new FormControl(''),
  });

  // Show error if any
  showError = false;
  errorMessage = '';

  constructor(
    private storeService: StoreService,
    private snackbar: SnackBarService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    const subscription = this.storeService.getPaymentSettings().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.initForm(result.data);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  initForm(settings: any) {
    this.paymentForm.patchValue({
      account_name: settings.account_name,
      account_number: settings.account_number,
      bank_name: settings.bank_name,
      bank_address: settings.bank_address,
      routing_number: settings.routing_number,
      iban: settings.iban,
      swift_code: settings.swift_code,
    });
  }

  onSubmit(): void {
    this.spinnerService.show();
    const subscription = this.storeService.postPaymentSettings(this.paymentForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar('Payment settings updated');
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
