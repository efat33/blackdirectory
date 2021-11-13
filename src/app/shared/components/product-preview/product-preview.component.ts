import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { ProductQuickViewModal } from 'src/app/modals/product-quick-view/product-quick-view.component';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductList, ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/user/user.service';
import { HelperService } from '../../helper.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css'],
})
export class ProductPreviewComponent implements OnInit, AfterViewInit {
  @Input() product: ProductList;

  @ViewChild('container') containerRef: ElementRef<HTMLDivElement>;
  @ViewChild('image') imageRef: ElementRef<HTMLImageElement>;
  @ViewChild('productTitle') productTitle: ElementRef<HTMLHeadingElement>;

  resizeObservable$ = fromEvent(window, 'resize');
  width: number = 250;
  hovered = false;
  quickViewModalRef: MatDialogRef<ProductQuickViewModal, { product: ProductList }>;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private dialog: MatDialog,
    private wishlistService: WishlistService,
    private helperService: HelperService
  ) {}

  get hasDiscount(): boolean {
    return this.productService.hasDiscount(this.product);
  }

  get isInWishlist(): boolean {
    return this.wishlistService.isProductInWishlist(this.product);
  }

  ngOnInit(): void {}

  showLoginModalIfNotLoggedIn(): boolean {
    const isLoggedIn = this.helperService.currentUserInfo != null;
    if (!isLoggedIn) {
      this.userService.onLoginLinkModal.emit();
    }
    return !isLoggedIn;
  }

  ngAfterViewInit(): void {
    this.resizeObservable$.pipe(startWith(''), debounceTime(5)).subscribe((evt) => {
      this.width = this.containerRef.nativeElement.offsetWidth;
      this.imageRef.nativeElement.style.maxWidth = `${this.width - 26}px`;
      this.imageRef.nativeElement.style.height = `${this.width - 26}px`;

      this.productTitle.nativeElement.style.maxWidth = `${this.width - 26 - 16 - 1}px`;
    });
  }

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
  }

  showQuickView(): void {
    this.quickViewModalRef = this.dialog.open(ProductQuickViewModal, {
      width: '800px',
      data: { product: this.product },
    });
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
