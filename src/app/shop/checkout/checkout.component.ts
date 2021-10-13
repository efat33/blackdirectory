import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { CartItemPopulated, CartService } from 'src/app/shared/services/cart.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Country, StoreService } from 'src/app/shared/services/store.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  dataSource = new MatTableDataSource<CartItemPopulated>([]);
  displayedColumns = ['product', 'product_price', 'subtotal'];

  subtotal$: Observable<number> = this.cartService.subtotal;
  discountAmount$: Observable<number> = this.cartService.discountAmount;
  total$: Observable<number> = this.cartService.total;
  countries$: Observable<Country[]> = this.storeService.getCountries();

  shippingForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    company_name: new FormControl(''),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    country_id: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    postcode: new FormControl('', [Validators.required]),
  });
  additionalInfo = new FormControl('');

  get shippingOptionsForm(): FormArray {
    return this.cartService.shippingOptionsForm;
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private helperService: HelperService,
    private storeService: StoreService,
    private orderService: OrderService,
    private dialog: MatDialog
  ) {}

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
    if (this.helperService.currentUserInfo) {
      this.shippingForm.patchValue(this.helperService.currentUserInfo);
    }
  }

  showLoginModalIfNotLoggedIn(): boolean {
    const isLoggedIn = this.helperService.currentUserInfo != null;
    if (!isLoggedIn) {
      this.userService.onLoginLinkModal.emit();
    }
    return !isLoggedIn;
  }

  onSubmit(): void {
    if (this.shippingForm.invalid) {
      return;
    }
    if (this.showLoginModalIfNotLoggedIn()) {
      return;
    }
    forkJoin({
      items: this.cartService.cart.pipe(
        take(1),
        map((cartItems) =>
          cartItems.map((cartItem) => ({
            price: cartItem.product_price,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
          }))
        )
      ),
      shipping: of(this.shippingForm.value),
      additional_info: of(this.additionalInfo.value),
      shipping_methods: of(this.cartService.getShippingMethods()),
      promo_id: this.cartService.appliedCoupon.pipe(
        take(1),
        map((coupon) => coupon.id)
      ),
    })
      .pipe(mergeMap((params) => this.orderService.postNewOrder(params)))
      .subscribe(
        (orderId) => {
          this.cartService.clearCart();
          this.router.navigate(['/shop', 'success', orderId]);
        },
        (err) => {
          console.log(err);
          this.router.navigate(['/shop', 'checkout-fail']);
        }
      );
  }
}
