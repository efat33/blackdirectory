import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { SharedModule } from '../shared/shared.module';
import { RatingModule } from 'ng-starrating';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { ShopComponent } from './shop/shop.component';
import { CheckoutFailComponent } from './checkout-fail/checkout-fail.component';

@NgModule({
  declarations: [
    ProductComponent,
    CartComponent,
    CheckoutComponent,
    CheckoutSuccessComponent,
    ShopComponent,
    CheckoutFailComponent,
  ],
  imports: [CommonModule, ShopRoutingModule, SharedModule, RatingModule],
})
export class ShopModule {}
