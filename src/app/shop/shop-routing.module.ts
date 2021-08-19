import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductResolver } from './product/product.resolver';
import { OrderResolver } from '../shared/components/order-details/order.resolver';
import { CartComponent } from './cart/cart.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'product/:slug', component: ProductComponent, resolve: { product: ProductResolver } },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'success/:id', component: CheckoutSuccessComponent, resolve: { order: OrderResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
