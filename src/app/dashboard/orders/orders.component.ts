import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { OrderList, OrderService } from 'src/app/shared/services/order.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  dataSource = new MatTableDataSource<OrderList>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  displayedColumns = ['id', 'date', 'status', 'total', 'actions'];

  constructor(private orderService: OrderService, private snackbar: SnackBarService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading$.next(true);
    this.orderService
      .gerOrders()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(
        (orders) => {
          this.dataSource.data = orders;
        },
        (err) => {
          this.snackbar.openSnackBar('An error occured while fetching orders.');
        }
      );
  }
}
