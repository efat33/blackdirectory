import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddJobSectorModalComponent } from './add-job-sector-modal/add-job-sector-modal';
import { JobService } from 'src/app/jobs/jobs.service';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';

declare const google: any;

@Component({
  selector: 'app-job-sectors',
  templateUrl: './job-sectors.component.html',
  styleUrls: ['./job-sectors.component.scss'],
})
export class JobSectorsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  sectors = [];

  displayedColumns: string[] = ['title', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private jobService: JobService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getJobSectors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getJobSectors() {
    this.spinnerService.show();
    const subscription = this.jobService.getSectors().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.sectors = result.data;
        this.dataSource.data = this.sectors;
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

  addSector() {
    const dialogConfig = {
      width: '550px',
    };

    const dialogSubscription = this.dialog
      .open(AddJobSectorModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getJobSectors();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editSector(sector: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        sector,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddJobSectorModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getJobSectors();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteSector(sector: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the sector?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.jobService.deleteJobSector(sector.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getJobSectors();
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
