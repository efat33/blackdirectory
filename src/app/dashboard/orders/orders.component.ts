import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { OrderList } from 'src/app/shared/services/order.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  orders$: Observable<OrderList[]> = this.activatedRoute.data.pipe(
    pluck<Data, OrderList[]>('orders'),
    catchError(() => {
      this.snackbar.openSnackBar('An error occured while fetching orders.');
      return of([]);
    })
  );

  constructor(private snackbar: SnackBarService, private activatedRoute: ActivatedRoute) {}
}
