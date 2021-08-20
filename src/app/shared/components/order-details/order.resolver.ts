import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from '../../services/order.service';

@Injectable({ providedIn: 'root' })
export class OrderResolver implements Resolve<any> {
  constructor(private orderService: OrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const orderId = route.params.id;
    return this.orderService.getOrderDetails(orderId);
  }
}
