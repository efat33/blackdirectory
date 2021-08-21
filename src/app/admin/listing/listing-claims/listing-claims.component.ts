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
import { ListingService } from 'src/app/listing/listing.service';

declare const google: any;

@Component({
  selector: 'app-listing-claims',
  templateUrl: './listing-claims.component.html',
  styleUrls: ['./listing-claims.component.scss'],
})
export class ListingClaimsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  allClaims = [];

  displayedColumns: string[] = ['title', 'username', 'firstname', 'lastname', 'email', 'phone', 'status', 'created_at', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private listingService: ListingService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getClaims();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClaims() {
    this.spinnerService.show();

    const subscription = this.listingService.getClaims({}).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        
        this.allClaims = result.data;
        this.dataSource.data = this.allClaims;
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

  approveClaim(claim:any){
    this.spinnerService.show();
    
    const subsApproveClaim = this.listingService.approveClaim(claim.id).subscribe(
      (res:any) => {
      
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message);
        this.getClaims();
    
      },
      (res:any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
      }
    );
    
    this.subscriptions.add(subsApproveClaim);
  }

  deleteClaim(claim:any){
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the claim?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
    
        const subsDeleteClaim = this.listingService.deleteClaim(claim.id).subscribe(
          (res:any) => {
          
            this.spinnerService.hide();
            this.getClaims();
        
          },
          (res:any) => {
            this.spinnerService.hide();
            this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
          }
        );
        
        this.subscriptions.add(subsDeleteClaim);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);
    
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
