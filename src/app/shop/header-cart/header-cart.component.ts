import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { CartService, Cart, CartItemPopulated } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-header-cart',
  templateUrl: './header-cart.component.html',
  styleUrls: ['./header-cart.component.css'],
})
export class HeaderCartComponent implements OnInit {
  cart$: Observable<Cart> = this.cartService.cart.pipe(
    map((items) =>
      items.map((item) => ({
        ...item,
        product_image: this.helperService.getImageUrl(item.product_image, 'product', 'thumb'),
      }))
    )
  );
  cartItemCount$: Observable<number> = this.cartService.cartItemCount;
  subtotal$: Observable<number> = this.cartService.subtotal;

  constructor(private cartService: CartService, private helperService: HelperService) {}

  ngOnInit(): void {}

  getItemImageStyle(productImage: string): string {
    return `background-image: url('${productImage}')`;
  }

  removeProduct(itemId: number): void {
    this.cartService.removeCartItem(itemId);
  }

  trackByFn = (index: number, item: CartItemPopulated) => `${index}-${item.id}`;
}
