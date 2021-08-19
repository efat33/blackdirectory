import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { SharedModule } from '../shared/shared.module';
import { RatingModule } from 'ng-starrating';
import { ProductPreviewComponent } from './product-preview/product-preview.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { ShopComponent } from './shop/shop.component';

@NgModule({
  declarations: [ProductComponent, CartComponent, ProductPreviewComponent, CheckoutComponent, CheckoutSuccessComponent, ShopComponent],
  imports: [CommonModule, ShopRoutingModule, SharedModule, RatingModule],
})
export class ShopModule {}
