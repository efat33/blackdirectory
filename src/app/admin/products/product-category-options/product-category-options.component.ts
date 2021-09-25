import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { ProductService } from 'src/app/shared/services/product.service';
import { AddProductCategoryOptionModalComponent } from './add-product-category-option-modal/add-product-category-option-modal';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddProductOptionChoiceModalComponent } from './add-product-option-choice-modal/add-product-option-choice-modal';

declare const google: any;

@Component({
  selector: 'app-product-category-options',
  templateUrl: './product-category-options.component.html',
  styleUrls: ['./product-category-options.component.scss'],
})
export class ProductCategoryOptionsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  options = [];
  selectedOption: any;

  displayedColumns: string[] = ['title', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('optionsTableSort') optionsTableSort: MatSort;
  @ViewChild('choicesTableSort') choicesTableSort: MatSort;

  displayedColumnsChoicesTable: string[] = ['title', 'choice_order', 'action'];
  dataSourceChoicesTable: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getProductCategoryOptions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.optionsTableSort;
  }

  getProductCategoryOptions() {
    this.spinnerService.show();
    const subscription = this.productService.getCategoryOptions().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.options = result.data;
        this.dataSource.data = this.options;

        this.selectPreviouslySelectedRow();
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

  addOption() {
    const dialogConfig = {
      width: '550px'
    };

    const dialogSubscription = this.dialog
      .open(AddProductCategoryOptionModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getProductCategoryOptions();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editOption(option: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        option
      },
    };

    const dialogSubscription = this.dialog
      .open(AddProductCategoryOptionModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getProductCategoryOptions();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteOption(option: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the option?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.productService.deleteCategoryOption(option.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getProductCategoryOptions();
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

  selectOption(row: any) {
    if (!row || this.selectedOption === row) {
      this.selectedOption = null;
      this.dataSourceChoicesTable.data = [];
    } else {
      this.selectedOption = row;
      this.dataSourceChoicesTable.data = row.choices;

      setTimeout(() => {
        this.dataSourceChoicesTable.sort = this.choicesTableSort;
      }, 0);
    }
  }

  selectPreviouslySelectedRow() {
    if (!this.selectedOption) {
      return;
    }

    const option = this.dataSource.data.find((row: any) => row.id === this.selectedOption.id);

    this.selectOption(option);
  }

  addChoice() {
    const dialogConfig = {
      width: '550px',
      data: {
        option: this.selectedOption
      },
    };

    const dialogSubscription = this.dialog
      .open(AddProductOptionChoiceModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getProductCategoryOptions();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editChoice(choice: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        choice,
        option: this.selectedOption
      },
    };

    const dialogSubscription = this.dialog
      .open(AddProductOptionChoiceModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getProductCategoryOptions();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteChoice(choice: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the choice?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.productService.deleteOptionChoice(choice.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getProductCategoryOptions();
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
