import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { HelperService } from 'src/app/shared/helper.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductList, ProductService } from 'src/app/shared/services/product.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-product-quick-view-modal',
  templateUrl: './product-quick-view.component.html',
  styleUrls: ['./product-quick-view.component.css'],
})
// tslint:disable-next-line: component-class-suffix
export class ProductQuickViewModal implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ProductQuickViewModal>,
    @Inject(MAT_DIALOG_DATA) public data: { product: ProductList },
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private helperService: HelperService,
    private wishlistService: WishlistService,
    private dialog: MatDialog
  ) {}
  addToCartCount: number = 1;
  galleryOptions: NgxGalleryOptions[] = [
    {
      width: '100%',
      thumbnailsColumns: 4,
      thumbnailsAsLinks: false,
      preview: true,
      startIndex: 0,
    },
    {
      breakpoint: 720,
      width: '100%',
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20,
    },
  ];
  images: NgxGalleryImage[];

  get hasDiscount(): boolean {
    return this.productService.hasDiscount(this.product);
  }

  get price(): number {
    return this.productService.getActualPrice(this.product);
  }

  get product(): ProductList {
    return this.data.product;
  }

  get isInWishlist(): boolean {
    return this.wishlistService.isProductInWishlist(this.product);
  }

  ngOnInit(): void {
    this.images = [this.product.image, ...this.product.galleries].map((image) => ({
      small: this.helperService.getImageUrl(image, 'product', 'thumb'),
      medium: this.helperService.getImageUrl(image, 'product', 'medium'),
      big: this.helperService.getImageUrl(image, 'product', 'full'),
    }));
  }

  showLoginModalIfNotLoggedIn(): boolean {
    const isLoggedIn = this.helperService.currentUserInfo != null;
    if (!isLoggedIn) {
      this.userService.onLoginLinkModal.emit();
    }
    return !isLoggedIn;
  }

  addToCart(): void {
    this.cartService.addToCart(this.product, this.addToCartCount);
  }

  addToWishlist(): void {
    if (this.showLoginModalIfNotLoggedIn()) {
      return;
    }
    this.wishlistService.addProduct(this.product);
  }

  removeFromWishlist(): void {
    this.wishlistService.removeProduct(this.product);
  }
}
