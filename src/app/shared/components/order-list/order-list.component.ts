import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderList } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit, OnChanges {
  @Input() orders: OrderList[] = [];

  dataSource = new MatTableDataSource<OrderList>([]);
  displayedColumns = ['id', 'date', 'status', 'total', 'actions'];

  constructor() {}

  ngOnInit(): void {
    this.dataSource.data = this.orders;
  }

  ngOnChanges(): void {
    this.dataSource.data = this.orders;
  }

  loadData(data: OrderList[]): void {
    this.dataSource.data = data;
  }
}
