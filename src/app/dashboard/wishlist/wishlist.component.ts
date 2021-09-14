import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HelperService } from 'src/app/shared/helper.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductList, ProductService, StockStatus } from 'src/app/shared/services/product.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  adminProfit = this.helperService.adminProfit;
  displayedColumns: string[] = ['image', 'title', 'price', 'stock_status', 'add_to_cart', 'remove'];
  dataSource: MatTableDataSource<ProductList>;

  constructor(
    private productService: ProductService,
    private helperService: HelperService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.loadProducts();
  }

  getProductPrice(product: ProductList): number {
    return this.productService.getActualPrice(product);
  }

  getStockStatusText(stockStatus: StockStatus): string {
    switch (stockStatus) {
      case 'instock':
        return 'In stock';
      case 'outstock':
        return 'Out of stock';
      case 'backorder':
        return 'Back order';
      default:
        return '';
    }
  }

  loadProducts(): void {
    this.wishlistService.getProducts().subscribe((products) => {
      this.dataSource.data = products;
    });
  }

  addToCart(product: ProductList): void {
    this.cartService.addToCart(product, 1);
  }

  removeFromWishlist(product: ProductList): void {
    this.wishlistService.removeProduct(product).subscribe((products) => {
      this.dataSource.data = products;
    });
  }
}
