import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AllOrdersListComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  orders: any[] = [];

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['id', 'date', 'status', 'total', 'actions'];

  expandedrow: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.dataSource.data = [];

    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.spinnerService.show();
    const subscription = this.productService.getAllOrders().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.dataSource.data = this.processData(result.data);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  processData(orders: any) {
    const processedOrders = orders.filter((order: any) => order.parent_id === -1);

    for (const order of processedOrders) {
      order.subOrders = orders.filter((o: any) => o.parent_id === order.id);
    }

    return processedOrders;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
