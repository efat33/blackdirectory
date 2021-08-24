import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, finalize, tap } from 'rxjs/operators';
import { GetProductListBody, ProductList, ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  private params: GetProductListBody = {
    limit: 12,
    offset: 0,
    order: 'DESC',
    orderby: 'id',
  };
  hasMoreProducts = true;
  pending$ = new BehaviorSubject<boolean>(false);
  products$ = new BehaviorSubject<ProductList[]>([]);
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
  trackByIdentity = (index: number, item: ProductList) => item.id;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        distinctUntilChanged(),
        tap(({ category, tag }) => {
          this.hasMoreProducts = true;
          this.params = {
            ...this.params,
            offset: 0,
            params: {
              ...this.params.params,
              ...(category ? { category } : { category: undefined }),
              ...(tag ? { tag } : { tag: undefined }),
            },
          };
        })
      )
      .subscribe(() => {
        this.loadMore();
      });
  }

  loadMore(): void {
    if (this.pending$.value || !this.hasMoreProducts) {
      return;
    }
    this.pending$.next(true);
    const params = this.params;
    this.productService
      .getProductList(params)
      .pipe(
        finalize(() => this.pending$.next(false)),
        tap((products) => this.products$.next([...this.products$.value, ...products])),
        tap(() => {
          this.params = {
            ...params,
            offset: params.offset + params.limit,
          };
        }),
        tap((products) => {
          if (products.length < this.params.limit) {
            this.hasMoreProducts = false;
          }
        })
      )
      .subscribe();
  }

  onSortChange(value: { orderby: string; order: 'ASC' | 'DESC' }): void {
    this.params = {
      ...this.params,
      ...(value ? value : this.sortOptions[0].value),
      limit: this.params.limit,
      offset: 0,
    };
    this.hasMoreProducts = true;
    this.products$.next([]);
    this.loadMore();
  }
}
