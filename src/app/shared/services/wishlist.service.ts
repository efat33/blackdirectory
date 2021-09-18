import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck, map, switchMapTo } from 'rxjs/operators';
import { HelperService } from '../helper.service';
import { SnackBarService } from '../snackbar.service';
import { ApiResponse, ProductDetails, ProductList } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private products$ = new BehaviorSubject<ProductList[]>([]);
  private BASE_URL = 'api/shop/wishlist';

  constructor(private http: HttpClient, private snackbar: SnackBarService, private helperService: HelperService) {}

  get products(): Observable<ProductList[]> {
    return this.products$.asObservable();
  }

  private postProduct(productId: number): Observable<undefined> {
    return this.http.post<ApiResponse<undefined>>(`${this.BASE_URL}/${productId}`, {}).pipe(pluck('data'));
  }

  private deleteProduct(productId: number): Observable<undefined> {
    return this.http.delete<ApiResponse<undefined>>(`${this.BASE_URL}/${productId}`).pipe(pluck('data'));
  }

  private getProducts(): Observable<ProductList[]> {
    return this.http.get<ApiResponse<any>>(this.BASE_URL).pipe(
      pluck('data'),
      map((products) =>
        products.map((p) => ({
          ...p,
          is_downloadable: Boolean(p.is_downloadable),
          is_virtual: Boolean(p.is_virtual),
          discount_end: p.discount_end ? new Date(p.discount_end) : null,
          discount_start: p.discount_start ? new Date(p.discount_start) : null,
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
          rating_average: parseFloat(p.rating_average),
        }))
      )
    );
  }

  isProductInWishlist(product: ProductList | ProductDetails): boolean {
    const products = this.products$.value;
    return products.findIndex((p) => p.id === product.id) > -1;
  }

  setProducts(): void {
    this.getProducts().subscribe((data) => {
      this.products$.next(data);
    });
  }

  addProduct(product: ProductList | ProductDetails): void {
    this.postProduct(product.id)
      .pipe(switchMapTo(this.getProducts()))
      .subscribe(
        (data) => {
          this.products$.next(data);
          this.snackbar.openSnackBar(`${product.title} has been successfully added to your wishlist`);
        },
        (err) => {
          this.snackbar.openSnackBar(`An error occured while adding ${product.title} to your wishlist`);
        }
      );
  }

  removeProduct(product: ProductList | ProductDetails): void {
    this.deleteProduct(product.id)
      .pipe(switchMapTo(this.getProducts()))
      .subscribe(
        (data) => {
          this.products$.next(data);
          this.snackbar.openSnackBar(`${product.title} has been successfully removed from your wishlist`);
        },
        (err) => {
          this.snackbar.openSnackBar(`An error occured while removing ${product.title} from your wishlist`);
        }
      );
  }
}
