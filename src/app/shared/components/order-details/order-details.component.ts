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

  get shippingCosts(): number {
    if (this.order.shipping_fee > 0) {
      return this.order.shipping_fee;
    } else {
      return this.order.subOrders.reduce((acc, order) => acc + order.shipping_fee, 0);
    }
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.dataSource.data = this.order.items;
  }
}
