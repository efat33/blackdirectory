import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { pluck, shareReplay, map, take } from 'rxjs/operators';
import { StoreService } from 'src/app/shared/services/store.service';
import { WithdrawData, WithdrawService } from 'src/app/shared/services/withdraw.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit, OnDestroy {
  @ViewChild('form') form;

  subscriptions: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private withdrawService: WithdrawService,
    private snackbar: SnackBarService,
    private storeService: StoreService,
    private spinnerService: SpinnerService
  ) {}

  withdrawData$: Observable<WithdrawData> = this.activatedRoute.data.pipe(shareReplay(1), pluck('data'));
  paymentSettings: any;

  withdrawAmountValidator: AsyncValidatorFn = (c) => {
    return this.withdrawData$.pipe(
      take(1),
      pluck('current_balance'),
      map((currentAmount) => currentAmount >= c.value && c.value >= 1),
      map((isValid) => (isValid ? null : { invalidAmount: true }))
    );
  };
  // tslint:disable-next-line: member-ordering
  withdrawForm = new FormGroup({
    amount: new FormControl(null, [Validators.required], [this.withdrawAmountValidator]),
  });

  ngOnInit(): void {
    this.getPaymentData();
  }

  getPaymentData() {
    this.spinnerService.show();
    const subscription = this.storeService.getPaymentSettings().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.paymentSettings = result.data;

        if (!this.paymentSettings?.account_name) {
          this.router.navigate(['/dashboard/payment-settings']);
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  onSubmitWithdraw(): void {
    if (this.withdrawForm.invalid) {
      return;
    }
    const params = this.withdrawForm.value;
    this.withdrawService.postNewWithdrawRequest(params).subscribe((response) => {
      this.form.resetForm();
      this.withdrawForm.reset();
      if (response.success) {
        this.snackbar.openSnackBar('Withdraw request successfully made.');
        this.withdrawData$ = of(response.data);
      } else {
        this.snackbar.openSnackBar('Withdraw request could not be made.');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
