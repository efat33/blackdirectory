import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, mergeMap, mergeMapTo, pluck, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { OrderDetails, OrderService, OrderStatus } from 'src/app/shared/services/order.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  private _order$: ReplaySubject<OrderDetails> = new ReplaySubject<OrderDetails>();
  statusForm = new FormGroup({
    status: new FormControl('', [Validators.required]),
  });
  statusOptions: OrderStatus[] = [
    'Pending payment',
    'Processing',
    'On hold',
    'Completed',
    'Cancelled',
    'Refunded',
    'Failed',
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private snackbar: SnackBarService,
    private helperService: HelperService
  ) {}

  get order$(): Observable<OrderDetails> {
    return this._order$.asObservable().pipe(
      tap((order) => {
        const statusControl = this.statusForm.get('status');
        if (!statusControl.value) {
          statusControl.setValue(order.status);
        }
      })
    );
  }
  get isCustomerOrder$(): Observable<boolean> {
    return this.order$.pipe(
      map((order) => order.vendor_id),
      map((vendorId) => this.helperService.currentUserInfo.id === vendorId)
    );
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(pluck<Data, OrderDetails>('order')).subscribe(this._order$);
  }

  submitOrderStatus(): void {
    if (this.statusForm.invalid) {
      return;
    }
    const { status } = this.statusForm.value;
    this.activatedRoute.params
      .pipe(
        take(1),
        map(({ id }) => id),
        map((orderId) => ({ orderId, status })),
        switchMap((params) => this.orderService.putOrderStatus(params))
      )
      .subscribe(
        (res) => {
          this.snackbar.openSnackBar('Order status updated successfully.');
          this.activatedRoute.params
            .pipe(mergeMap(({ id }) => this.orderService.getOrderDetails(id)))
            .subscribe(this._order$);
        },
        (err) => {
          this.snackbar.openSnackBar('An error occured while updating order status.');
        }
      );
  }
}
