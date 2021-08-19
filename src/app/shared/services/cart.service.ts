import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, mergeMapTo, pluck, shareReplay, tap } from 'rxjs/operators';
import { ApiResponse, ProductDetails } from 'src/app/shared/services/product.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from '../helper.service';

interface ProductCartBase {
  id: number;
  product_id: number;
  product_image: string;
  product_price: number;
  product_slug: string;
  product_title: string;
}
interface ProductCartApi extends ProductCartBase {
  quantity: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}
interface ProductCart extends ProductCartBase {
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
export interface Coupon {
  code: string;
  id: number;
  discount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private BASE_URL = 'api/shop/cart';
  private LOCAL_STORAGE_KEY = 'blackdirectory_cart';
  private appliedCoupon$ = new BehaviorSubject<Coupon>({
    code: '',
    discount: 0,
    id: null,
  });
  private cart$ = new BehaviorSubject<Cart>([]);
  private isLoggedIn: boolean = this.helperService.currentUserInfo != null;

  constructor(private http: HttpClient, private snackbar: SnackBarService, private helperService: HelperService) {
    this.initCart();
  }

  get appliedCoupon(): Observable<Coupon> {
    return this.appliedCoupon$.asObservable().pipe(shareReplay(1));
  }
  get cart(): Observable<Cart> {
    return this.cart$.asObservable().pipe(shareReplay(1));
  }

  get subtotal(): Observable<number> {
    return this.cart.pipe(map((cart) => cart.reduce((acc, item) => acc + item.quantity * item.product_price, 0)));
  }
  get discountAmount(): Observable<number> {
    return combineLatest([this.subtotal, this.appliedCoupon]).pipe(
      map(([subtotal, coupon]) => ({ subtotal, discount: coupon.discount })),
      map(({ subtotal, discount }) => subtotal * (discount / 100))
    );
  }
  get total(): Observable<number> {
    return combineLatest([this.subtotal, this.discountAmount]).pipe(
      map(([subtotal, discountAmount]) => subtotal - discountAmount)
    );
  }

  get cartItemCount(): Observable<number> {
    return this.cart$.pipe(map((cart) => cart.reduce((acc, item) => acc + item.quantity, 0)));
  }

  private initCart(): void {
    const localCart = this.getLocalCart();
    if (this.isLoggedIn) {
      this.getCartItems()
        .pipe(
          map<Cart, { local: Cart; server: Cart }>((server) => ({ server, local: localCart })),
          map<{ local: Cart; server: Cart }, { local: Cart; server: Cart; merge: Cart }>(({ local, server }) => ({
            local,
            server,
            merge: this.mergeCarts(local, server),
          })),
          mergeMap(({ server, merge }) => {
            // Updates server if merge cart is different;
            const getItemQuantity = (cart: Cart, productId: number): number => {
              const i = cart.findIndex((item) => item.product_id === productId);
              return i < 0 ? 0 : cart[i].quantity;
            };
            const diff = merge.filter(
              (mergeItem) => mergeItem.quantity !== getItemQuantity(server, mergeItem.product_id) || !mergeItem.id
            );
            if (diff.length > 0) {
              return this.postCartItems(diff);
            } else {
              return of(merge);
            }
          }),
          tap((items) => this.cart$.next(items)),
          tap((items) => this.updateLocalStorage(items))
        )
        .subscribe();
    } else {
      this.cart$.next(localCart);
    }
  }

  private parseProductCart(p: ProductCartApi): CartItemPopulated {
    return {
      ...p,
      created_at: new Date(p.created_at),
      updated_at: new Date(p.updated_at),
    };
  }

  private getLocalCart(): Cart {
    const localstorage = localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]';
    const cart = JSON.parse(localstorage);
    return cart;
  }

  private updateLocalStorage(cart: Cart): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }

  private mergeCarts(localCart: Cart, serverCart: Cart): Cart {
    const uniqueServerItems = serverCart.filter(
      (serverItem) => localCart.findIndex((localItem) => localItem.product_id === serverItem.product_id) < 0
    );
    return localCart.concat(uniqueServerItems);
  }

  private productDetailsToCartItemPopulated(product: ProductDetails, quantity: number): CartItemPopulated {
    return {
      id: null,
      quantity,
      product_id: product.id,
      product_image: product.image,
      product_price: product.price,
      product_slug: product.slug,
      product_title: product.title,
      created_at: new Date(),
      updated_at: new Date(),
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

  private getPromoCode(code: string): Observable<Coupon> {
    return this.http.get<ApiResponse<any>>(`api/shop/promo-code/${code}`).pipe(
      pluck('data'),
      map((data) => data[0]),
      catchError((_) => {
        return of({
          code: '',
          discount: 0,
          id: null,
        });
      })
    );
  }

  addToCart(product: ProductDetails, quantity: number = 1): void {
    if (this.isLoggedIn) {
      this.postCartItems([{ product_id: product.id, quantity }]).subscribe(
        (cart) => {
          this.cart$.next(cart);
          this.updateLocalStorage(cart);
          this.snackbar.openSnackBar(`"${product.title}" has been added to your cart.`);
        },
        (err) => {
          console.log(err);
          this.snackbar.openSnackBar(`An error occured while adding product to the cart.`);
        }
      );
    } else {
      const cart = this.cart$.value;
      const i = cart.findIndex((item) => item.product_id === product.id);
      if (i < 0) {
        const cartItem = this.productDetailsToCartItemPopulated(product, quantity);
        cart.push(cartItem);
        this.cart$.next(cart);
        this.updateLocalStorage(cart);
      } else {
        cart[i].quantity = quantity;
      }
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.cart$.value;
    const i = cart.findIndex((item) => item.product_id === productId);
    console.log(cart, productId);
    if (i < 0) {
      return;
    }
    cart[i].quantity = quantity;
    if (this.isLoggedIn) {
      this.postCartItems([{ product_id: productId, quantity }]).subscribe(
        (serverCart) => {
          this.cart$.next(serverCart);
          this.updateLocalStorage(serverCart);
        },
        (err) => {
          console.log(err);
          this.snackbar.openSnackBar(`An error occured while adding product to the cart.`);
        }
      );
    } else {
      this.cart$.next(cart);
      this.updateLocalStorage(cart);
    }
  }

  removeCartItem(productId: number): void {
    const cart = this.cart$.value;
    const i = cart.findIndex((item) => item.product_id === productId);
    if (this.isLoggedIn) {
      const cartItemId = cart[i].id;
      this.deleteCartItem(cartItemId).subscribe(
        (serverCart) => {
          this.cart$.next(serverCart);
          this.updateLocalStorage(serverCart);
          this.snackbar.openSnackBar(`Item removed from your cart.`);
        },
        (err) => {
          console.log(err);
          this.snackbar.openSnackBar(`An error occured while removing product from the cart.`);
        }
      );
    } else {
      if (i < -1) {
        cart.splice(i, 1);
        this.cart$.next(cart);
        this.updateLocalStorage(cart);
      }
    }
  }

  clearCart(): void {
    this.clearCartItems().subscribe(
      (res) => {
        this.cart$.next([]);
        this.updateLocalStorage([]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  applyCoupon(code: string): Observable<boolean> {
    return this.getPromoCode(code).pipe(
      tap((coupon) => this.appliedCoupon$.next(coupon)),
      map((coupon) => coupon.discount > 0)
    );
  }
}
