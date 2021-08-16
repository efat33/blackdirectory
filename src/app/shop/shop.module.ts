import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { SharedModule } from '../shared/shared.module';
import { ProductPreviewComponent } from './product-preview/product-preview.component';

@NgModule({
  declarations: [ProductComponent, CartComponent, ProductPreviewComponent],
  imports: [CommonModule, ShopRoutingModule, SharedModule],
})
export class ShopModule {}
