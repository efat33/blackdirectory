import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { ProductService, StockStatus } from 'src/app/shared/services/product.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { ProductsDataSource } from './products-data-source';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { SnackBarService } from 'src/app/shared/snackbar.service';

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
  subscriptions: Subscription = new Subscription();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['image', 'title', 'stock_status', 'price', 'earning', 'views', 'created_at', 'action'];
  dataSource: ProductsDataSource;

  // Search
  categories$: Observable<{ id: number; title: string }[]> = this.productService.getCategories();
  filterForm = new FormGroup({
    keyword: new FormControl(''),
    category: new FormControl(''),
  });

  totalNumProducts$ = this.productService.getTotalNumberOfProducts({ user_id: this.userId });
  adminProfit = this.helperService.adminProfit;

  constructor(
    private productService: ProductService, 
    private helperService: HelperService, 
    private router: Router,
    private spinnerService: SpinnerService,
    private dialog: MatDialog,
    private snackbar: SnackBarService
    ) {}

  get userId(): number {
    return this.helperService.currentUserInfo.id;
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
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

  onDeleteProduct(product: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the product?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.productService.deleteProduct(product.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();
            this.snackbar.openSnackBar(result.message, 'Close');

            // repopulate the products
            this.getProducts();
          },
          (error) => {
            this.spinnerService.hide();
            this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
          }
        );

        this.subscriptions.add(subscription);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);
  }

}
