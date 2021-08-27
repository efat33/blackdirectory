import { Component, Input, OnInit } from '@angular/core';
import { ProductDetails, ProductList, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.css'],
})
export class ProductPriceComponent implements OnInit {
  @Input() product: ProductDetails | ProductList;

  constructor(private productService: ProductService) {}

  get hasDiscount(): boolean {
    return this.productService.hasDiscount(this.product);
  }

  ngOnInit(): void {}
}
