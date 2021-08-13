import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { GetProductListBody, Product, ProductService } from '../services/product.service';
import { ProductFilter } from './products.component';

export class ProductsDataSource implements DataSource<Product> {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadParams = new BehaviorSubject<GetProductListBody>({
    limit: 25,
    offset: 0,
    order: 'ASC',
    orderby: 'title',
  });
  loading$ = this.loadingSubject.asObservable();

  constructor(private productService: ProductService) {}

  connect(collectionViewer: CollectionViewer): Observable<Product[]> {
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
      params: filter,
    });
    this.loadProducts();
  }

  loadProducts() {
    this.productsSubject.next([]);
    this.loadingSubject.next(true);

    this.productService
      .getProductList(this.loadParams.value)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((products) => this.productsSubject.next(products));
  }
}