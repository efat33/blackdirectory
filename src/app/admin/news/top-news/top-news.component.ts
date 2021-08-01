import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { HelperService } from 'src/app/shared/helper.service';
import { NewsService } from 'src/app/news/news.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

declare const google: any;

@Component({
  selector: 'app-top-news',
  templateUrl: './top-news.component.html',
  styleUrls: ['./top-news.component.scss'],
})
export class TopNewsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  categories = [];
  news = [];
  categoryNews = {};

  topNews = {};

  constructor(
    private dialog: MatDialog,
    private newsService: NewsService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.getTopNews();
    this.getNewsAndCategories();
  }

  getTopNews() {
    this.spinnerService.show();
    const subscription = this.newsService.getTopNews().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        for (const news of result.data) {
          if (news.category_id != null && news.news_id != null) {
            this.topNews[news.category_id] = news.news_id;
          }
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getNewsAndCategories() {
    const newsSub = this.newsService.getNewsByQuery({}, 100);
    const categorySub = this.newsService.getNewsCategories();

    this.spinnerService.show();
    forkJoin([newsSub, categorySub]).subscribe(
      (results: any) => {
        this.spinnerService.hide();

        this.news = results[0].data;
        this.categories = results[1].data;

        for (const category of this.categories) {
          this.categoryNews[category.id] = this.getCategoryNews(category);
        }
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );
  }

  getCategoryNews(category: any) {
    return this.news.filter((singleNews: any) => singleNews.category_id === category.id);
  }

  updateTopNews() {
    this.spinnerService.show();
    const subscription = this.newsService.updateTopNews(this.topNews).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar('Update successful');
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getNewsByFilter(category: any, filterString: string) {
    if (!category) {
      return this.news.filter((news: any) => news.title.toLowerCase().includes(filterString.toLowerCase()));
    }

    if (this.categoryNews[category.id]) {
      return this.categoryNews[category.id].filter((news: any) =>
        news.title.toLowerCase().includes(filterString.toLowerCase())
      );
    }

    return [];
  }

  clearFilter(opened: boolean, filterInput: any) {
    if (!opened) {
      filterInput.value = '';
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
