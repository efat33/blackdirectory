import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { GetProductListBody, ProductList, ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  sort = '';
  private params: GetProductListBody = {
    limit: 12,
    offset: 0,
    order: 'ASC',
    orderby: 'id',
  };
  hasMoreProducts = true;
  pending$ = new BehaviorSubject<boolean>(false);
  products$ = new BehaviorSubject<ProductList[]>([]);
  trackByIdentity = (index: number, item: ProductList) => item.id;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadMore();
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
      ...(!value ? { order: 'ASC', orderby: 'id' } : value),
      limit: this.params.limit,
      offset: 0,
    };
    this.hasMoreProducts = true;
    this.products$.next([]);
    this.loadMore();
  }
}
