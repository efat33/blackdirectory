import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Injectable({ providedIn: 'root' })
export class VendorResolver implements Resolve<any> {
  constructor(
    private storeService: StoreService,
    private helperService: HelperService,
    private productService: ProductService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.params.id;
    return forkJoin([
      this.storeService.getStoreSettings(id).pipe(
        map((data) => ({
          ...data,
          profile_picture: this.helperService.getImageUrl(data?.profile_picture, 'shop', 'full'),
          banner: this.helperService.getImageUrl(data?.banner, 'shop', 'full'),
        }))
      ),
      this.productService.getProductList(
        {
          limit: 12,
          offset: 0,
          order: 'DESC',
          orderby: 'id',
          params: { user_id: id },
        },
        false
      ),
    ]).pipe(map(([vendorInfo, vendorProducts]) => ({ vendorInfo, vendorProducts })));
  }
}
