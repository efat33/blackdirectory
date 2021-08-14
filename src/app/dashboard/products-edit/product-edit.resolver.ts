import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductService } from '../services/product.service';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<any> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const productSlug = route.params.slug;
    return this.productService.getProductDetails(productSlug, false);
  }
}
