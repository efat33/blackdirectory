import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMapTo, pluck, share, shareReplay } from 'rxjs/operators';
import { ApiResponse, ProductDetails } from 'src/app/shared/services/product.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

interface ProductCartApi {
  created_at: string;
  id: number;
  product_id: number;
  product_image: string;
  product_price: number;
  product_slug: string;
  product_title: string;
  quantity: number;
  updated_at: string;
  user_id: number;
}

interface ProductCart {
  id: number;
  product_id: number;
  product_image: string;
  product_price: number;
  product_slug: string;
  product_title: string;
  created_at: Date;
  updated_at: Date;
}

interface CartItem {
  quantity: number;
  product_id: number;
}

export interface CartItemPopulated extends ProductCart {
  quantity: number;
}

export type Cart = CartItemPopulated[];

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private BASE_URL = 'api/shop/cart';
  private cart$ = new BehaviorSubject<Cart>([]);

  constructor(private http: HttpClient, private snackbar: SnackBarService) {
    this.initCart();
  }

  get cart(): Observable<Cart> {
    return this.cart$.asObservable().pipe(shareReplay());
  }

  get subtotal(): Observable<number> {
    return this.cart$.pipe(map((cart) => cart.reduce((acc, item) => acc + item.quantity * item.product_price, 0)));
  }

  get cartItemCount(): Observable<number> {
    return this.cart$.pipe(map((cart) => cart.reduce((acc, item) => acc + item.quantity, 0)));
  }

  private initCart(): void {
    this.getCartItems().subscribe((items) => this.cart$.next(items));
  }

  private parseProductCart(p: ProductCartApi): CartItemPopulated {
    return {
      ...p,
      created_at: new Date(p.created_at),
      updated_at: new Date(p.updated_at),
    };
  }

  private getCartItems(): Observable<Cart> {
    return this.http.get<ApiResponse<ProductCartApi[]>>(this.BASE_URL).pipe(
      pluck('data'),
      map((items) => items.map((item) => this.parseProductCart(item)))
    );
  }

  private postCartItems(items: CartItem[]): Observable<Cart> {
    return this.http
      .post<ApiResponse<ProductCartApi>>(this.BASE_URL, { items })
      .pipe(pluck('data'), mergeMapTo(this.getCartItems()));
  }

  private deleteCartItem(itemId: number): Observable<Cart> {
    return this.http
      .delete<ApiResponse<undefined>>(`${this.BASE_URL}/${itemId}`)
      .pipe(pluck('data'), mergeMapTo(this.getCartItems()));
  }

  private clearCartItems(): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.BASE_URL}-clear`);
  }

  addToCart(product: ProductDetails, quantity: number = 1): void {
    this.postCartItems([{ product_id: product.id, quantity }]).subscribe(
      (cart) => {
        console.log(cart);
        this.cart$.next(cart);
        this.snackbar.openSnackBar(`"${product.title}" has been added to your cart.`);
      },
      (err) => {
        console.log(err);
        this.snackbar.openSnackBar(`An error occured while adding product to the cart.`);
      }
    );
  }

  removeCartItem(itemId: number): void {
    this.deleteCartItem(itemId).subscribe(
      (cart) => {
        console.log(cart);
        this.cart$.next(cart);
        this.snackbar.openSnackBar(`Item removed from your cart.`);
      },
      (err) => {
        console.log(err);
        this.snackbar.openSnackBar(`An error occured while removing product from the cart.`);
      }
    );
  }

  clearCart(): void {
    this.clearCartItems().subscribe(
      (res) => {
        this.cart$.next([]);
        this.snackbar.openSnackBar(`Cart cleared.`);
      },
      (err) => {
        console.log(err);
        this.snackbar.openSnackBar(`An error occured while clearing the cart.`);
      }
    );
  }
}
