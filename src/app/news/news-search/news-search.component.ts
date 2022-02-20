import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news-search',
  templateUrl: './news-search.component.html',
  styleUrls: ['./news-search.component.scss'],
})
export class NewsSearchComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  pageHeadline: string = 'News';
  categorySlug: string;
  categoryId: number;

  allNews: any;
  newsByCategory = {};
  categories = [];

  topNewsId: number;
  topNews: any;

  featuredNews: any;

  newsPerSection: number = 50;

  queryParams = {
    keyword: ''
  };

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private snackbar: SnackBarService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
  ) {
    
  }

  ngOnInit() {
    // get params from url
    this.queryParams.keyword = this.route.snapshot.queryParamMap.get('keyword');
    
    this.getCategories();
  }

  getCategories() {
    const subscription = this.newsService.getNewsCategories().subscribe(
      (result: any) => {
        this.categories = result.data;

        if (this.categorySlug) {
          this.categoryId = result.data.find((cat: any) => cat.slug === this.categorySlug)?.id;
          this.pageHeadline = result.data.find((cat: any) => cat.slug === this.categorySlug)?.name;
        } else {
          for (const category of result.data) {
            this.newsByCategory[category.id] = null;
          }
        }

        this.getSearchNews();
      },
      (error) => {
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getSearchNews() {
    
    const subscription = this.newsService
      .getNewsByQuery(this.queryParams, this.newsPerSection)
      .subscribe(
        (result: any) => {
          this.allNews = result.data;
        },
        (error) => {
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

    this.subscriptions.add(subscription);
  }


  getCategory(categoryId: string) {
    return this.categories.find((cat: any) => cat.id === parseInt(categoryId));
  }

  onSubmitSearch() {
    this.spinnerService.show();
    const subscription = this.newsService
      .getNewsByQuery(this.queryParams, this.newsPerSection)
      .subscribe(
        (result: any) => {
          this.spinnerService.hide();
          this.allNews = result.data;
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
