import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { map, pluck } from 'rxjs/operators';
import { ProductDetails, ProductReview, ProductService } from 'src/app/shared/services/product.service';
import { HelperService } from 'src/app/shared/helper.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserService } from 'src/app/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { LoginModal } from 'src/app/modals/user/login/login-modal';
import { MatDialog } from '@angular/material/dialog';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @ViewChild('form') form;
  p: ProductDetails;
  reviews$: Observable<ProductReview[]>;
  storeDetails$: Observable<any>;
  relatedProducts$: Observable<any>;
  review = new FormGroup({
    rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    review: new FormControl('', Validators.required),
  });
  reviewTouched = false;
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
  reviewTrackBy = (index: number, item: ProductReview) => item.id;

  constructor(
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private cartService: CartService,
    private productService: ProductService,
    private storeService: StoreService,
    private snackbar: SnackBarService,
    private dialog: MatDialog,
    private wishlistService: WishlistService
  ) {}

  get hasDiscount(): boolean {
    return this.productService.hasDiscount(this.p);
  }

  get price(): number {
    return this.productService.getActualPrice(this.p);
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(pluck<Data, ProductDetails>('product')).subscribe((p) => {
      this.p = p;
      this.reviews$ = this.productService.getProductReview(this.p.id);
      this.relatedProducts$ = this.productService.getRelatedProducts(this.p.slug);
      this.storeDetails$ = this.storeService.getStoreSettings(this.p.user_id).pipe(
        map((data) => ({
          ...data,
          profile_picture: this.helperService.getImageUrl(data?.profile_picture, 'shop', 'full'),
          banner: this.helperService.getImageUrl(data?.banner, 'shop', 'full'),
        }))
      );
      this.images = [this.p.image, ...this.p.galleries].map((name) => ({
        small: this.helperService.getImageUrl(name, 'product', 'thumb'),
        medium: this.helperService.getImageUrl(name, 'product', 'medium'),
        big: this.helperService.getImageUrl(name, 'product', 'full'),
      }));
    });
  }

  onRate({ newValue }: { newValue: number }): void {
    this.review.get('rating').setValue(newValue);
  }

  showLoginModalIfNotLoggedIn(): boolean {
    const isLoggedIn = this.helperService.currentUserInfo != null;
    if (!isLoggedIn) {
      this.dialog.open(LoginModal, {
        width: '400px',
      });
    }
    return !isLoggedIn;
  }

  submitReview(): void {
    this.reviewTouched = true;
    if (this.review.invalid) {
      return;
    }
    if (this.showLoginModalIfNotLoggedIn()) {
      return;
    }
    const { rating, review } = this.review.value;
    this.productService.postNewProductReview({ product_id: this.p.id, rating, review }).subscribe(
      (res) => {
        this.reviewTouched = false;
        this.review.reset();
        this.form.resetForm();
        this.reviews$ = of(res);
      },
      (err) => {
        const multipleReviewMessage = 'You have already reviewed this product';
        if (err instanceof HttpErrorResponse && err.error.message === multipleReviewMessage) {
          this.snackbar.openSnackBar(multipleReviewMessage);
        }
      }
    );
  }

  addToCart(): void {
    this.cartService.addToCart(this.p, this.addToCartCount);
  }

  addToWishlist(product: ProductDetails): void {
    if (this.showLoginModalIfNotLoggedIn()) {
      return;
    }
    this.wishlistService.addProduct(product);
  }
}
