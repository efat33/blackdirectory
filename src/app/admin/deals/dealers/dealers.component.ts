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
import { DealsService } from 'src/app/deals/deals.service';
import { AddDealerModalComponent } from './add-dealer-modal/add-dealer-modal';

declare const google: any;

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss'],
})
export class DealersComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  dealers = [];

  displayedColumns: string[] = ['name', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private dealsService: DealsService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getDealers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDealers() {
    this.spinnerService.show();
    const subscription = this.dealsService.getDealers().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.dealers = result.data;
        this.dataSource.data = this.dealers;
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

  addDealer() {
    const dialogConfig = {
      width: '550px',
    };

    const dialogSubscription = this.dialog
      .open(AddDealerModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getDealers();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editDealer(dealer: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        dealer,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddDealerModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getDealers();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteDealer(dealer: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the dealer?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.dealsService.deleteDealer(dealer.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getDealers();
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
