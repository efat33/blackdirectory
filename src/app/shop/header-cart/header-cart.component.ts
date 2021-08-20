import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { CartService, Cart, CartItemPopulated } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-header-cart',
  templateUrl: './header-cart.component.html',
  styleUrls: ['./header-cart.component.css'],
})
export class HeaderCartComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

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

  constructor(private cartService: CartService, private helperService: HelperService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.menuTrigger.closeMenu();
    });
  }

  getItemImageStyle(productImage: string): string {
    return `background-image: url('${productImage}')`;
  }

  removeProduct(productId: number): void {
    this.cartService.removeCartItem(productId);
  }

  trackByFn = (index: number, item: CartItemPopulated) => `${index}-${item.id}`;
}
