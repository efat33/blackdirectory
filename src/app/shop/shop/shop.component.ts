import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, switchMapTo, tap } from 'rxjs/operators';
import { GetProductListParams, ProductList, ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  params: GetProductListParams = {};
  sort: { order: 'ASC' | 'DESC'; orderby: string } = {
    order: 'DESC',
    orderby: 'id',
  };
  totalItems = 0;
  pageSize = 30;
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
  loading$ = new BehaviorSubject<boolean>(false);
  trackByIdentity = (index: number, item: ProductList) => item.id;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        distinctUntilChanged(),
        tap(() => this.loading$.next(true)),
        tap(({ keyword, category, tag, price_min, price_max, brands, rating, choices }) => {
          this.currentPage = 1;
          this.params.keyword = keyword;
          this.params.category = category;
          this.params.tag = tag;
          this.params.price_min = price_min;
          this.params.price_max = price_max;
          this.params.brands = typeof brands === 'string' ? [parseInt(brands)] : brands;
          this.params.choices = typeof choices === 'string' ? [parseInt(choices)] : choices;
          this.params.rating = rating;
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

  onSearchProduct() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        keyword: this.params.keyword
      },
      queryParamsHandling: 'merge',
    });
  }

  loadProducts(): void {
    const params = {
      ...this.sort,
      offset: (this.currentPage - 1) * this.pageSize,
      limit: this.pageSize,
      params: this.params,
    };
    this.productService
      .getProductList(params, false)
      .pipe(
        tap((products) => (this.products = products)),
        catchError(() => of([])),
        finalize(() => this.loading$.next(false))
      )
      .subscribe();
  }
}
