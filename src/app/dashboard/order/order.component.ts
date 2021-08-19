import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { OrderDetails } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  order$: Observable<OrderDetails> = this.activatedRoute.data.pipe(pluck<Data, OrderDetails>('order'));

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}
}
