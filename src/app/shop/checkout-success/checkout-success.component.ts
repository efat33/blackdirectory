import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { OrderDetails } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css'],
})
export class CheckoutSuccessComponent implements OnInit {
  order$: Observable<OrderDetails> = this.activatedRoute.data.pipe(pluck<Data, OrderDetails>('order'));

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}
}
