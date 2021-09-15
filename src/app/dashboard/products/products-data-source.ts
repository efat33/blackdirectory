import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { GetProductListBody, ProductList, ProductService } from 'src/app/shared/services/product.service';
import { ProductFilter } from './products.component';

export class ProductsDataSource implements DataSource<ProductList> {
  private productsSubject = new BehaviorSubject<ProductList[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadParams = new BehaviorSubject<GetProductListBody>({
    limit: 25,
    offset: 0,
    order: 'ASC',
    orderby: 'title',
    params: {
      user_id: this.userId,
    },
  });
  loading$ = this.loadingSubject.asObservable();

  constructor(private productService: ProductService, private userId: number) {}

  connect(collectionViewer: CollectionViewer): Observable<ProductList[]> {
    return this.productsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.productsSubject.complete();
    this.loadingSubject.complete();
  }

  setPagination(pageIndex: number, pageSize: number): void {
    this.loadParams.next({
      ...this.loadParams.value,
      limit: pageSize,
      offset: pageIndex * pageSize,
    });
    this.loadProducts();
  }

  setSort(orderBy: string, order: 'asc' | 'desc'): void {
    if (orderBy === 'earning') {
      orderBy = 'price';
    }
    this.loadParams.next({
      ...this.loadParams.value,
      offset: 0, // Reset pagination
      orderby: orderBy,
      order: order.toUpperCase() as 'ASC' | 'DESC',
    });
    this.loadProducts();
  }

  setFilter(filter: ProductFilter): void {
    this.loadParams.next({
      ...this.loadParams.value,
      params: {
        ...this.loadParams.value,
        ...filter,
      },
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productsSubject.next([]);
    this.loadingSubject.next(true);

    this.productService
      .getProductList(this.loadParams.value, false)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((products) => this.productsSubject.next(products));
  }
}
