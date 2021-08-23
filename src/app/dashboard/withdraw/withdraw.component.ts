import { Component, OnInit, ViewChild } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { pluck, shareReplay, map, take } from 'rxjs/operators';
import { WithdrawData, WithdrawService } from 'src/app/shared/services/withdraw.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit {
  @ViewChild('form') form;

  constructor(
    private activatedRoute: ActivatedRoute,
    private withdrawService: WithdrawService,
    private snackbar: SnackBarService
  ) {}

  withdrawData$: Observable<WithdrawData> = this.activatedRoute.data.pipe(shareReplay(1), pluck('data'));
  paymentMethods = this.withdrawService.paymentMethods;

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
    payment_method: new FormControl('card', [Validators.required]),
  });

  ngOnInit(): void {}

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
}
