import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { pluck, map, tap, catchError, switchMapTo } from 'rxjs/operators';
import { SnackBarService } from '../snackbar.service';
import { ApiResponse, ProductDetails, ProductList } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private BASE_URL = 'api/shop/wishlist';

  constructor(private http: HttpClient, private snackbar: SnackBarService) {}

  private postProduct(productId: number): Observable<undefined> {
    return this.http.post<ApiResponse<undefined>>(`${this.BASE_URL}/${productId}`, {}).pipe(pluck('data'));
  }

  private deleteProduct(productId: number): Observable<undefined> {
    return this.http.delete<ApiResponse<undefined>>(`${this.BASE_URL}/${productId}`).pipe(pluck('data'));
  }

  getProducts(): Observable<ProductList[]> {
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

  addProduct(product: ProductList | ProductDetails): void {
    this.postProduct(product.id).subscribe(
      (res) => {
        this.snackbar.openSnackBar(`${product.title} has been successfully added to your wishlist`);
      },
      (err) => {
        this.snackbar.openSnackBar(`An error occured while adding ${product.title} to your wishlist`);
      }
    );
  }

  removeProduct(product: ProductList): Observable<ProductList[]> {
    return this.deleteProduct(product.id).pipe(
      tap(() => this.snackbar.openSnackBar(`${product.title} has been successfully removed from your wishlist`)),
      switchMapTo(this.getProducts()),
      catchError(() => {
        this.snackbar.openSnackBar(`An error occured while removing ${product.title} from your wishlist`);
        return of([]);
      })
    );
  }
}
