import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, mergeMapTo, pluck, shareReplay, tap } from 'rxjs/operators';
import { ApiResponse, ProductDetails, ProductList } from 'src/app/shared/services/product.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from '../helper.service';
import { ShippingOptionsService } from './shipping-options.service';
import { Coupon, CouponService } from './coupon.service';

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
  created_at: string;
  updated_at: string;
  user_id: number;
  vendor_id: number;
  vendor_display_name: string;
  vendor_username: string;
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
  user_id: number;
  vendor_id: number;
  vendor_display_name: string;
  vendor_username: string;
}
export type Cart = CartItemPopulated[];

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private BASE_URL = 'api/shop/cart';
  private CART_LOCAL_STORAGE_KEY = 'blackdirectory_cart';
  private cart$ = new BehaviorSubject<Cart>([]);
  private isLoggedIn: boolean = this.helperService.currentUserInfo != null;

  constructor(
    private http: HttpClient,
    private snackbar: SnackBarService,
    private helperService: HelperService,
    private shippingOptionsService: ShippingOptionsService,
    private couponService: CouponService
  ) {
    this.initCart();
  }

  get appliedCoupon(): Observable<Coupon> {
    return this.couponService.appliedCoupon;
  }
  get shippingOptionsForm(): FormArray {
    return this.shippingOptionsService.form;
  }
  get cart(): Observable<Cart> {
    return this.cart$.asObservable().pipe(shareReplay(1));
  }

  get subtotal(): Observable<number> {
    return this.cart.pipe(map((cart) => cart.reduce((acc, item) => acc + item.quantity * item.product_price, 0)));
  }

  get discountAmount(): Observable<number> {
    return combineLatest([this.subtotal, this.appliedCoupon]).pipe(
      map(([subtotal]) => this.couponService.calculateDiscountAmount(subtotal))
    );
  }

  get total(): Observable<number> {
    return combineLatest([this.subtotal, this.discountAmount]).pipe(
      map(([subtotal, discountAmount]) => subtotal - discountAmount)
    );
  }

  get totalAfterShipping(): Observable<number> {
    return combineLatest([this.subtotal, this.discountAmount, this.shippingOptionsService.totalShippingCost$]).pipe(
      map(([subtotal, discountAmount, shippingCosts]) => subtotal - discountAmount + shippingCosts)
    );
  }

  get cartItemCount(): Observable<number> {
    return this.cart$.pipe(map((cart) => cart.reduce((acc, item) => acc + item.quantity, 0)));
  }

  private initCart(): void {
    const localCart = this.getLocalCart();
    if (this.isLoggedIn) {
      if (window.location.pathname === '/shop/payment' && window.location.search === '?success=true') {
        this.cart$.next([]);
        return;
      }

      this.getCartItems()
        .pipe(
          map<Cart, { local: Cart; server: Cart }>((server) => ({ server, local: localCart })),
          map<{ local: Cart; server: Cart }, { local: Cart; server: Cart; merge: Cart }>(({ local, server }) => ({
            local,
            server,
            merge: this.mergeCarts(local, server),
          })),
          // tslint:disable-next-line: no-shadowed-variable
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
    const localstorage = localStorage.getItem(this.CART_LOCAL_STORAGE_KEY) || '[]';
    const cart = JSON.parse(localstorage);
    return cart;
  }

  private updateLocalStorage(cart: Cart): void {
    cart = cart.filter((cartItem: any) => cartItem.product_slug != null);
    localStorage.setItem(this.CART_LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }

  private mergeCarts(localCart: Cart, serverCart: Cart): Cart {
    const uniqueServerItems = serverCart.filter(
      (serverItem) => localCart.findIndex((localItem) => localItem.product_id === serverItem.product_id) < 0
    );
    return localCart.concat(uniqueServerItems);
  }

  private productDetailsToCartItemPopulated(
    product: ProductDetails | ProductList,
    quantity: number
  ): CartItemPopulated {
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
      user_id: -1,
      vendor_id: product.user_id,
      vendor_display_name: product.store_name || product.user_display_name || '---',
      vendor_username: product.user_username || '---',
    };
  }

  setShippingMethods(cart: Cart, countryID?: number) {
    const vendorsMap = this.shippingOptionsService.extractVendorsFromItems(cart || []);
    this.shippingOptionsService.updateShippingOptionsForm(vendorsMap, countryID);
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

  addToCart(product: ProductDetails | ProductList, quantity: number = 1): void {
    const previousQuantity = this.cart$.value.find((item) => item.product_id === product.id)?.quantity || 0;
    const newQuantity = previousQuantity + quantity;
    if (this.isLoggedIn) {
      this.postCartItems([{ product_id: product.id, quantity: newQuantity }]).subscribe(
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
        const cartItem = this.productDetailsToCartItemPopulated(product, newQuantity);
        cart.push(cartItem);
      } else {
        cart[i].quantity = newQuantity;
      }
      this.cart$.next(cart);
      this.snackbar.openSnackBar(`"${product.title}" has been added to your cart.`);
      this.updateLocalStorage(cart);
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      return;
    }
    const cart = this.cart$.value;
    const i = cart.findIndex((item) => item.product_id === productId);
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
      if (i > -1) {
        cart.splice(i, 1);
        this.cart$.next(cart);
        this.updateLocalStorage(cart);
      }
    }
  }

  clearCart(): void {
    this.cart$.next([]);
    this.updateLocalStorage([]);
    this.clearCartItems().subscribe();
  }

  applyCoupon(code: string): Observable<boolean> {
    return this.couponService.applyCoupon(code);
  }

  getShippingMethods(): { vendor_id: number; shipping_id: number }[] {
    return this.shippingOptionsService.getShippingIds();
  }
}
