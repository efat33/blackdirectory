import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';
import { NewsService } from 'src/app/news/news.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddNewsCategoryModalComponent } from './add-news-category-modal/add-news-category-modal';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';

declare const google: any;

@Component({
  selector: 'app-news-categories',
  templateUrl: './news-categories.component.html',
  styleUrls: ['./news-categories.component.scss'],
})
export class NewsCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  categories = [];

  displayedColumns: string[] = ['name', 'count', 'category_order', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private newsService: NewsService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getNewsCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getNewsCategories() {
    this.spinnerService.show();
    const subscription = this.newsService.getNewsCategories().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.categories = result.data;
        this.dataSource.data = this.categories;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCategory() {
    const dialogConfig = {
      width: '550px',
    };

    const dialogSubscription = this.dialog
      .open(AddNewsCategoryModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getNewsCategories();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editCategory(category: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        category,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddNewsCategoryModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getNewsCategories();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteCategory(category: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the category?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.newsService.deleteNewsCategory(category.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getNewsCategories();
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
