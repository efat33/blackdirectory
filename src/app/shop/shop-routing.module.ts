import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductResolver } from './product/product.resolver';
import { OrderResolver } from '../shared/components/order-details/order.resolver';
import { CartComponent } from './cart/cart.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
import { ShopComponent } from './shop/shop.component';
import { EmptyCartGuard } from './checkout/empty-cart.guard';
import { CheckoutFailComponent } from './checkout-fail/checkout-fail.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorResolver } from './vendor/vendor-resolver';
import { AuthGuard } from '../shared/route-guards/auth-guard.service';
import { CheckoutPaymentReturnComponent } from './checkout-payment-return/checkout-payment-return.component';

const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'product/:slug', component: ProductComponent, resolve: { product: ProductResolver } },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [EmptyCartGuard] },
  { path: 'success/:id', component: CheckoutSuccessComponent, resolve: { order: OrderResolver } },
  { path: 'checkout-fail', component: CheckoutFailComponent },
  { path: 'vendor/:id', component: VendorComponent, resolve: { data: VendorResolver } },
  { path: 'payment', component: CheckoutPaymentReturnComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
