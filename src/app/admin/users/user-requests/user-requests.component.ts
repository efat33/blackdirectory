import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.scss'],
})
export class UserRequestsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  users: any[] = [];

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['email', 'request_type', 'description', 'requested_at', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.dataSource.data = [];

    this.loadData();
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.spinnerService.show();
    const subscription = this.userService.getUserRequest().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.dataSource.data = result.data;
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

  onClickDeactivateAccount(request) {
    this.spinnerService.show();
    
    const subsDeactivateAccount = this.userService.userRequestDeactivate(request).subscribe(
      (res:any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message, 'Close');

        this.loadData();
      },
      (res:any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message, 'Close', 'warn');
      }
    );
    
    this.subscriptions.add(subsDeactivateAccount);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
