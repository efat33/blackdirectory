import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { pluck } from 'rxjs/operators';
import { ProductDetails, ProductService } from 'src/app/shared/services/product.service';
import { HelperService } from 'src/app/shared/helper.service';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  p: ProductDetails;
  addToCartCount: number = 1;
  galleryOptions: NgxGalleryOptions[] = [
    {
      width: '100%',
      height: '400px',
      thumbnailsColumns: 4,
      arrowPrevIcon: 'fa fa-chevron-left',
      arrowNextIcon: 'fa fa-chevron-right',
      imageAnimation: NgxGalleryAnimation.Slide,
    },
    {
      breakpoint: 720,
      width: '100%',
      height: '600px',
      thumbnailsColumns: 4,
      arrowPrevIcon: 'fa fa-chevron-left',
      arrowNextIcon: 'fa fa-chevron-right',
      imageAnimation: NgxGalleryAnimation.Slide,
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20,
    },
    {
      breakpoint: 400,
      preview: false,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private cartService: CartService,
    private productService: ProductService
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
  }

  addToCart(): void {
    this.cartService.addToCart(this.p, this.addToCartCount);
  }
}
