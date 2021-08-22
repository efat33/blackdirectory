import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { map, pluck } from 'rxjs/operators';
import { ProductDetails, ProductReview, ProductService } from 'src/app/shared/services/product.service';
import { HelperService } from 'src/app/shared/helper.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  p: ProductDetails;
  reviews$: Observable<ProductReview[]>;
  storeDetails$: Observable<any>;
  relatedProducts$: Observable<any>;
  review = new FormGroup({
    rating: new FormControl(4, [Validators.required]),
    review: new FormControl('', Validators.required),
  });
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private cartService: CartService,
    private productService: ProductService,
    private storeService: StoreService,
    private userService: UserService
  ) {}

  get hasDiscount(): boolean {
    return this.productService.hasDiscount(this.p);
  }

  get price(): number {
    return this.productService.getActualPrice(this.p);
  }

  get images(): NgxGalleryImage[] {
    return [this.p.image, ...this.p.galleries].map((name) => ({
      small: this.helperService.getImageUrl(name, 'product', 'thumb'),
      medium: this.helperService.getImageUrl(name, 'product', 'medium'),
      big: this.helperService.getImageUrl(name, 'product', 'full'),
    }));
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(pluck<Data, ProductDetails>('product')).subscribe((p) => {
      this.p = p;
      console.log(p);
    });
    this.reviews$ = this.productService.getProductReview(this.p.id);
    this.relatedProducts$ = this.productService.getRelatedProducts(this.p.slug);
    this.storeDetails$ = this.storeService.getStoreSettings(this.p.user_id).pipe(
      map((data) => ({
        ...data,
        profile_picture: this.helperService.getImageUrl(data.profile_picture, 'store', 'full'),
        banner: this.helperService.getImageUrl(data.banner, 'store', 'full'),
      }))
    );
  }

  onRate({ newValue }: { newValue: number }): void {
    this.review.get('rating').setValue(newValue);
  }

  submitReview(): void {
    if (this.review.invalid) {
      return;
    }
    if (this.userService.showLoginModalIfNotLoggedIn()) {
      return;
    }
    const { rating, review } = this.review.value;
    this.productService.postNewProductReview({ product_id: this.p.id, rating, review }).subscribe((res) => {
      this.reviews$ = this.productService.getProductReview(this.p.id);
    });
  }

  addToCart(): void {
    this.cartService.addToCart(this.p, this.addToCartCount);
  }
}
