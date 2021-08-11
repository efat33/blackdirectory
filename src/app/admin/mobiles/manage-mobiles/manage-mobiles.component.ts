import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';
import { MobilesService } from 'src/app/mobiles/mobiles.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';

declare const google: any;

@Component({
  selector: 'app-manage-mobiles',
  templateUrl: './manage-mobiles.component.html',
  styleUrls: ['./manage-mobiles.component.scss'],
})
export class ManageMobilesComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  allMobiles = [];

  displayedColumns: string[] = [
    'provider_logo',
    'category',
    'cost',
    'data',
    'minutes',
    'texts',
    'contract_length',
    'link',
    'action',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private mobilesService: MobilesService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getMobiles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMobiles() {
    this.spinnerService.show();
    const subscription = this.mobilesService.getMobiles().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.allMobiles = result.data;
        this.dataSource.data = this.allMobiles;
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

  deleteMobiles(mobiles: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.mobilesService.deleteMobile(mobiles.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();
            this.getMobiles();
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

  getCategoryName(mobile: any) {
    const category = this.mobilesService.categories.find((category: any) => category.value === mobile.category);

    return category?.title || '';
  }

  isUnlimited(value: any) {
    return value === this.mobilesService.unlimitedNumber;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
