import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PaymentMethods, WithdrawService } from 'src/app/shared/services/withdraw.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-withdraw-requests',
  templateUrl: './withdraw-requests.component.html',
  styleUrls: ['./withdraw-requests.component.scss'],
})
export class AllWithdrawRequestsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  requests: any[] = [];

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['id', 'amount', 'payment_method', 'status', 'date', 'approve'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private withdrawService: WithdrawService,
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
    const subscription = this.withdrawService.getAllData().subscribe(
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

  getPaymentMethodLabel(paymentMethod: PaymentMethods): string {
    return this.withdrawService.paymentMethods.find((m) => m.value === paymentMethod)?.label || 'Unknown';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
