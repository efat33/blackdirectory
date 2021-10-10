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
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { AddEventOrganizerModalComponent } from './add-event-organizer-modal/add-event-organizer-modal';
import { EventService } from 'src/app/events/event.service';

declare const google: any;

@Component({
  selector: 'app-event-organizers',
  templateUrl: './event-organizers.component.html',
  styleUrls: ['./event-organizers.component.scss'],
})
export class EventOrganizersComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  organizers = [];

  displayedColumns: string[] = ['name', 'phone', 'website', 'email', 'action'];
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
    this.getEventOrganizers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getEventOrganizers() {
    this.spinnerService.show();
    const subscription = this.eventService.getOrganisers().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.organizers = result.data;
        this.dataSource.data = this.organizers;
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

  addOrganizer() {
    const dialogConfig = {
      width: '550px',
    };

    const dialogSubscription = this.dialog
      .open(AddEventOrganizerModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getEventOrganizers();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editOrganizer(organizer: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        organizer,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddEventOrganizerModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getEventOrganizers();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteOrganizer(organizer: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the organizer?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.eventService.deleteOrganizer(organizer.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getEventOrganizers();
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
