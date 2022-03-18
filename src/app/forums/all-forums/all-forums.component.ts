import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForumService } from 'src/app/forums/forum.service';
import { ListingService } from 'src/app/listing/listing.service';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { HelperService } from 'src/app/shared/helper.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';

@Component({
  selector: 'app-all-forums',
  templateUrl: './all-forums.component.html',
  styleUrls: ['./all-forums.component.scss'],
})
export class AllForumsComponent implements OnInit {
  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  constructor(
    public listingService: ListingService,
    public forumService: ForumService,
    public spinnerService: SpinnerService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snackbarService: SnackBarService,
    private seo: SeoService,
  ) {
    this.route.params.subscribe((params) => {
      this.catID = this.route.snapshot.paramMap.get('cat_id');
      if(this.catID) this.queryParams.cat_id = this.catID;

      this.getForums();
    });
  }

  forumCategories = [];
  catID: any;

  queryParams = {
    keyword: '',
    limit: 12,
    page: 1,
    status: 'open',
    cat_id: '',
  };

  forums: any;
  totalForums: any;

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;
    
    this.getForumCategories();
  }

  setSeoData(sData) {
    this.seo.generateTags({
      title: '', 
      description: '', 
      image: '',
      slug: `forums`,
      keywords: '',
    });
  }

  getForums(page: number = 1) {
    this.queryParams.page = page;
    
    this.spinnerService.show();

    const subsForums = this.forumService.getForums(this.queryParams).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.forums = res.data.data.forums;
        this.totalForums = res.data.data.total_forums;
      },
      (res: any) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subsForums);
  }

  getForumCategories() {
    this.spinnerService.show();
    const getSectorsSubscription = this.forumService.getCategories().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.forumCategories = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbarService.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getSectorsSubscription);
  }

  onClickCategory(catID) {
    window.location.href = `${this.siteUrl}/forums/category/${catID}`;
  }

  onPageChange(newPage: number) {
    this.getForums(newPage);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
