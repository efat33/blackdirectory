import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OrderService } from 'src/app/shared/services/order.service';

@Injectable({ providedIn: 'root' })
export class OrdersResolver implements Resolve<any> {
  constructor(private orderService: OrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const side: 'buyer' | 'seller' = route.params.side;
    if (side === 'buyer') {
      return this.orderService.getOrders();
    } else if (side === 'seller') {
      return this.orderService.getVendorOrders();
    } else {
      return of([]);
    }
  }
}
