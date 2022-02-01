import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentMethods, WithdrawRequestData, WithdrawService } from 'src/app/shared/services/withdraw.service';

@Component({
  selector: 'app-withdraw-requests-table',
  templateUrl: './withdraw-requests-table.component.html',
  styleUrls: ['./withdraw-requests-table.component.css'],
})
export class WithdrawRequestsTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @Input() data: WithdrawRequestData[];

  dataSource = new MatTableDataSource<WithdrawRequestData>([]);
  displayedColumns = ['id', 'amount', 'status', 'date'];

  constructor(private withdrawService: WithdrawService) {}

  ngOnInit(): void {}

  getPaymentMethodLabel(paymentMethod: PaymentMethods): string {
    return this.withdrawService.paymentMethods.find((m) => m.value === paymentMethod)?.label || 'Unknown';
  }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
