import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductList, ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css'],
})
export class ProductPreviewComponent implements OnInit, AfterViewInit {
  @Input() product: ProductList;

  @ViewChild('container') containerRef: ElementRef<HTMLDivElement>;
  @ViewChild('image') imageRef: ElementRef<HTMLImageElement>;

  resizeObservable$ = fromEvent(window, 'resize');
  width: number = 250;

  constructor(private productService: ProductService, private cartService: CartService) {}

  get hasDiscount(): boolean {
    return this.productService.hasDiscount(this.product);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.resizeObservable$.pipe(startWith(''), debounceTime(5)).subscribe((evt) => {
      this.width = this.containerRef.nativeElement.offsetWidth;
      this.imageRef.nativeElement.style.maxWidth = `${this.width}px`;
      this.imageRef.nativeElement.style.height = `${this.width}px`;
    });
  }

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
  }
}
