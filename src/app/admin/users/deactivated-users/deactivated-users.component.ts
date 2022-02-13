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
  selector: 'app-deactivated-users',
  templateUrl: './deactivated-users.component.html',
  styleUrls: ['./deactivated-users.component.scss'],
})
export class DeactivatedUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  users: any[] = [];

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['profile_photo', 'display_name', 'email', 'role', 'action'];

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
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.spinnerService.show();
    const subscription = this.userService.getDeactivatedUsers().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.dataSource.data = result;
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

  onClickReactivateAccount(user) {
    this.spinnerService.show();
    
    const subsReactivateAccount = this.userService.userRequestReactivate(user).subscribe(
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
    
    this.subscriptions.add(subsReactivateAccount);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
