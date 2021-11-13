import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { AddMobileProviderModalComponent } from './add-mobile-providers-modal/add-mobile-providers-modal';
import { MobilesService } from 'src/app/mobiles/mobiles.service';

declare const google: any;

@Component({
  selector: 'app-mobile-providers',
  templateUrl: './mobile-providers.component.html',
  styleUrls: ['./mobile-providers.component.scss'],
})
export class MobileProvidersComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  providers = [];

  displayedColumns: string[] = ['title', 'logo', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private mobilesService: MobilesService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getMobileProviders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMobileProviders() {
    this.spinnerService.show();
    const subscription = this.mobilesService.getMobileProviders().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.providers = result.data;
        this.dataSource.data = this.providers;
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

  addProvider() {
    const dialogConfig = {
      width: '550px',
    };

    const dialogSubscription = this.dialog
      .open(AddMobileProviderModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getMobileProviders();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editProvider(provider: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        provider,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddMobileProviderModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getMobileProviders();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteProvider(provider: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the provider?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.mobilesService.deleteMobileProvider(provider.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getMobileProviders();
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
