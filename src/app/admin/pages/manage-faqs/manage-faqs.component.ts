import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from 'src/app/jobs/jobs.service';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { AddFaqModalComponent } from './add-faq-modal/add-faq-modal';
import { PagesService } from 'src/app/pages/pages.service';

declare const google: any;

@Component({
  selector: 'app-manage-faqs',
  templateUrl: './manage-faqs.component.html',
  styleUrls: ['./manage-faqs.component.scss'],
})
export class ManageFaqsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  faqs = [];

  displayedColumns: string[] = ['question', 'faq_order', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private pagesService: PagesService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getFaqs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getFaqs() {
    this.spinnerService.show();
    const subscription = this.pagesService.getFaqs().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.faqs = result.data;
        this.dataSource.data = this.faqs;
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

  addFaq() {
    const dialogConfig = {
      width: '550px',
    };

    const dialogSubscription = this.dialog
      .open(AddFaqModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getFaqs();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editFaq(faq: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        faq,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddFaqModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getFaqs();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteFaq(faq: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      panelClass: 'confimation-dialog',
      data: { message: 'Are you sure to delete the FAQ?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.pagesService.deleteFaq(faq.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getFaqs();
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
