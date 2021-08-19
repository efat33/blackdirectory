import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.gerOrders().subscribe(console.log);
  }
}
