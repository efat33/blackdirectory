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
import { AddEventTagModalComponent } from './add-event-tag-modal/add-event-tag-modal';
import { EventService } from 'src/app/events/event.service';

declare const google: any;

@Component({
  selector: 'app-event-tags',
  templateUrl: './event-tags.component.html',
  styleUrls: ['./event-tags.component.scss'],
})
export class EventTagsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  tags = [];

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
    this.getEventTags();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getEventTags() {
    this.spinnerService.show();
    const subscription = this.eventService.getTags().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.tags = result.data;
        this.dataSource.data = this.tags;
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

  addTag() {
    const dialogConfig = {
      width: '550px',
    };

    const dialogSubscription = this.dialog
      .open(AddEventTagModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getEventTags();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  editTag(tag: any) {
    const dialogConfig = {
      width: '550px',
      data: {
        tag,
      },
    };

    const dialogSubscription = this.dialog
      .open(AddEventTagModalComponent, dialogConfig)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.getEventTags();
        }
      });

    this.subscriptions.add(dialogSubscription);
  }

  deleteTag(tag: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the tag?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        const subscription = this.eventService.deleteTag(tag.id).subscribe(
          (result: any) => {
            this.spinnerService.hide();

            this.getEventTags();
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
