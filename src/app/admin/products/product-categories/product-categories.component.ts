import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { ProductService } from 'src/app/shared/services/product.service';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { AddProductCategoryModalComponent } from './add-product-category-modal/add-product-category-modal';
import { AssignCategoryOptionsModalComponent } from './assign-option-modal/assign-option-modal';

declare const google: any;

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss'],
})
export class ProductCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  categories = [];
  selectedCategory: any;

  _transformer = (node: any, level: number) => {
    return {
      level,
      id: node.id,
      title: node.title,
      options: this.getCategoryOptions(node),
      optionsArray: node.options.map((optionArray: any) => ({
        id: optionArray[0].option_id,
        title: optionArray[0].option,
      })),
      expandable: !!node.subCategories && node.subCategories.length > 0,
    };
  };

  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.subCategories
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  hasChild = (_: number, node: any) => node.expandable;

  ngOnInit() {
    this.dataSource.data = [];
    this.getProductCategories();
  }

  ngAfterViewInit() {}

  getProductCategories() {
    this.spinnerService.show();
    const subscription = this.productService.getCategories().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.categories = result;

        this.dataSource.data = this.categories;
        this.selectedCategory = null;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  addCategory() {
    const dialogConfig = {
      width: '550px',
      data: {
        category: this.selectedCategory,
        edit: false,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddProductCategoryModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getProductCategories();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editCategory() {
    const dialogConfig = {
      width: '550px',
      data: {
        category: this.selectedCategory,
        edit: true,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddProductCategoryModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getProductCategories();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteCategory() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the category?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.productService.deleteCategory(this.selectedCategory.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getProductCategories();
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

  selectCategory(node: any) {
    if (this.selectedCategory === node) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = node;
    }
  }

  getCategoryOptions(category: any) {
    if (category.options?.length) {
      const options = category.options.map((optionArray: any) => optionArray[0].option);

      return `(${options.join(', ')})`;
    }

    return '';
  }

  assignOption() {
    const dialogConfig = {
      width: '550px',
      data: {
        category: this.selectedCategory,
      },
    };

    const dialogSubscription = this.dialog
      .open(AssignCategoryOptionsModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getProductCategories();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
