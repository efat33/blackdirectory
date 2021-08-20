import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDetails, OrderDetailsItem } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit, OnChanges {
  @Input() order: OrderDetails;

  dataSource = new MatTableDataSource<OrderDetailsItem>([]);
  displayedColumns = ['product', 'product_price', 'subtotal'];

  constructor() {}

  get isUpdated(): boolean {
    return this.order.created_at.getTime() !== this.order.updated_at.getTime();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.dataSource.data = this.order.items;
  }
}
