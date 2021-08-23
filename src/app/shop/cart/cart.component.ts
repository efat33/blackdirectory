import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { CartItemPopulated, CartService, Coupon } from 'src/app/shared/services/cart.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  dataSource = new MatTableDataSource<CartItemPopulated>([]);
  displayedColumns = ['product_image', 'product_title', 'product_price', 'quantity', 'subtotal', 'action'];

  appliedCoupon$: Observable<Coupon> = this.cartService.appliedCoupon;
  subtotal$: Observable<number> = this.cartService.subtotal;
  discountAmount$: Observable<number> = this.cartService.discountAmount;
  total$: Observable<number> = this.cartService.total;
  coupon = new FormControl('');

  constructor(
    private cartService: CartService,
    private helperService: HelperService,
    private snackbar: SnackBarService,
    private userService: UserService
  ) {}

  get cartItemCount$(): Observable<number> {
    return this.cartService.cartItemCount;
  }

  ngOnInit(): void {
    this.cartService.cart
      .pipe(
        map((items) =>
          items.map((item) => ({
            ...item,
            product_image: this.helperService.getImageUrl(item.product_image, 'product', 'thumb'),
          }))
        )
      )
      .subscribe((data) => {
        this.dataSource.data = data;
      });
    this.appliedCoupon$.subscribe((coupon) => {
      if (coupon.discount > 0) {
        this.coupon.setValue(coupon.code);
        this.coupon.disable();
      }
    });
  }

  removeProduct(productId: number): void {
    this.cartService.removeCartItem(productId);
  }

  incrementQuantity(cartItem: CartItemPopulated): void {
    this.cartService.updateQuantity(cartItem.product_id, cartItem.quantity + 1);
  }

  decrementQuantity(cartItem: CartItemPopulated): void {
    this.cartService.updateQuantity(cartItem.product_id, cartItem.quantity - 1);
  }

  submitCoupon(): void {
    const coupon = this.coupon.value;
    this.coupon.setErrors(null);
    if (!coupon) {
      return;
    }
    if (this.userService.showLoginModalIfNotLoggedIn()) {
      return;
    }
    this.cartService.applyCoupon(coupon).subscribe((isValid) => {
      if (isValid) {
        this.snackbar.openSnackBar(`Coupon applied.`);
        this.coupon.disable();
      } else {
        this.snackbar.openSnackBar(`Coupon is invalid`);
        this.coupon.setErrors({ invalid: true });
      }
    });
  }

  removeCoupon(): void {
    this.coupon.enable();
    this.coupon.setValue('');
    this.coupon.setErrors(null);
    this.cartService.applyCoupon('').subscribe();
  }
}
