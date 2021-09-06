import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, switchMapTo, tap } from 'rxjs/operators';
import { ProductList, ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  params: { category?: number; tag?: number } = {};
  sort: { order: 'ASC' | 'DESC'; orderby: string } = {
    order: 'DESC',
    orderby: 'id',
  };
  totalItems = 0;
  pageSize = 12;
  currentPage = 1;
  products: ProductList[] = [];
  sortOptions: { label: string; value: { order: 'ASC' | 'DESC'; orderby: string } }[] = [
    {
      label: 'Default sorting',
      value: {
        order: 'DESC',
        orderby: 'id',
      },
    },
    {
      label: 'Sort by popularity',
      value: {
        order: 'DESC',
        orderby: 'views',
      },
    },
    {
      label: 'Sort by average rating',
      value: {
        order: 'DESC',
        orderby: 'rating_average',
      },
    },
    {
      label: 'Sort by latest',
      value: {
        order: 'DESC',
        orderby: 'created_at',
      },
    },
    {
      label: 'Sort by price: low to high',
      value: {
        order: 'ASC',
        orderby: 'price',
      },
    },
    {
      label: 'Sort by price: high to low',
      value: {
        order: 'DESC',
        orderby: 'price',
      },
    },
  ];

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        distinctUntilChanged(),
        tap(({ category, tag, _vendor }) => {
          this.currentPage = 1;
          this.params.category = category ? category : undefined;
          this.params.tag = tag ? tag : undefined;
        }),
        switchMapTo(this.productService.getTotalNumberOfProducts(this.params)),
        tap((numProducts) => (this.totalItems = numProducts))
      )
      .subscribe(() => {
        this.loadProducts();
      });
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadProducts();
  }

  onSortChange(value?: { orderby: string; order: 'ASC' | 'DESC' }): void {
    this.currentPage = 1;
    this.sort = value || this.sortOptions[0].value;
    this.loadProducts();
  }

  loadProducts(): void {
    const params = {
      ...this.sort,
      offset: (this.currentPage - 1) * this.pageSize,
      limit: this.pageSize,
      params: this.params,
    };
    this.productService
      .getProductList(params)
      .pipe(tap((products) => (this.products = products)))
      .subscribe();
  }
}
