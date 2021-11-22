import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { SharedModule } from '../shared/shared.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { ShopComponent } from './shop/shop.component';
import { CheckoutFailComponent } from './checkout-fail/checkout-fail.component';
import { ShopSidebarComponent } from './shop-sidebar/shop-sidebar.component';
import { CategorySelectorComponent } from './shop-sidebar/category-selector/category-selector.component';
import { VendorComponent } from './vendor/vendor.component';
import { ShippingMethodSelectorComponent } from './shipping-method-selector/shipping-method-selector.component';
import { CheckoutPaymentReturnComponent } from './checkout-payment-return/checkout-payment-return.component';

@NgModule({
  declarations: [
    ProductComponent,
    CartComponent,
    CheckoutComponent,
    CheckoutSuccessComponent,
    ShopComponent,
    CheckoutFailComponent,
    ShopSidebarComponent,
    CategorySelectorComponent,
    VendorComponent,
    ShippingMethodSelectorComponent,
    CheckoutPaymentReturnComponent,
  ],
  imports: [CommonModule, ShopRoutingModule, SharedModule],
})
export class ShopModule {}
