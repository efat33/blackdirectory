import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { AddEventCategoryModalComponent } from './add-event-category-modal/add-event-category-modal';
import { EventService } from 'src/app/events/event.service';

declare const google: any;

@Component({
  selector: 'app-event-categories',
  templateUrl: './event-categories.component.html',
  styleUrls: ['./event-categories.component.scss'],
})
export class EventCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  categories = [];

  displayedColumns: string[] = ['title', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getEventCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getEventCategories() {
    this.spinnerService.show();
    const subscription = this.eventService.getCategories().subscribe(
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
      .open(AddEventCategoryModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getEventCategories();
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
      .open(AddEventCategoryModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getEventCategories();
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
        const subscription = this.eventService.deleteCategory(category.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getEventCategories();
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
