import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { ProductService, StockStatus } from 'src/app/shared/services/product.service';
import { ProductsDataSource } from './products-data-source';

export interface ProductFilter {
  category: number;
  keyword: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['image', 'title', 'stock_status', 'price', 'earning', 'views', 'created_at'];
  dataSource: ProductsDataSource;

  // Search
  categories$: Observable<{ id: number; title: string }[]> = this.productService.getCategories();
  filterForm = new FormGroup({
    keyword: new FormControl(''),
    category: new FormControl(''),
  });

  totalNumProducts$ = this.productService.getTotalNumberOfProducts({ user_id: this.userId });
  adminProfit = this.helperService.adminProfit;

  constructor(private productService: ProductService, private helperService: HelperService, private router: Router) {}

  get userId(): number {
    return this.helperService.currentUserInfo.id;
  }

  ngOnInit(): void {
    this.dataSource = new ProductsDataSource(this.productService, this.userId);
    this.dataSource.loadProducts();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.paginator.pageIndex = 0;
      this.dataSource.setSort(sort.active, sort.direction || 'asc');
    });

    this.paginator.page.subscribe(({ pageIndex, pageSize }) => {
      this.dataSource.setPagination(pageIndex, pageSize);
    });
  }

  getStockStatusText(stockStatus: StockStatus): string {
    switch (stockStatus) {
      case 'instock':
        return 'In stock';
      case 'outstock':
        return 'Out of stock';
      case 'backorder':
        return 'Back order';
      default:
        return '';
    }
  }

  applyFilter(): void {
    this.dataSource.setFilter(this.filterForm.value);
  }

  getEditProductLink(item: any) {
    const editRoutePathStart = `/${this.router.url.split('/')[1]}`;

    if (editRoutePathStart === '/admin') {
      return editRoutePathStart + '/product-edit/' + item.slug;
    }

    return editRoutePathStart + '/products/edit/' + item.slug;
  }
}
