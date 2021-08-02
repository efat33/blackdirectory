import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news-lists',
  templateUrl: './news-lists.component.html',
  styleUrls: ['./news-lists.component.scss'],
})
export class NewsListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  categorySlug: string;
  categoryId: number;

  allNews: any;
  newsByCategory = {};
  categories = [];

  topNewsId: number;
  topNews: any;

  featuredNews: any;

  newsPerSection: number = 3;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private snackbar: SnackBarService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.categorySlug = this.route.snapshot.paramMap.get('cat-slug');

    this.getCategories();
  }

  getCategories() {
    const subscription = this.newsService.getNewsCategories().subscribe(
      (result: any) => {
        this.categories = result.data;

        if (this.categorySlug) {
          this.categoryId = result.data.find((cat: any) => cat.slug === this.categorySlug)?.id;
        } else {
          for (const category of result.data) {
            this.newsByCategory[category.id] = null;
          }
        }

        this.getTopNewsId();
        this.getFeaturedNews();
      },
      (error) => {
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getTopNewsId() {
    const subscription = this.newsService.getTopNews().subscribe(
      (result: any) => {
        this.topNewsId = result.data.find((cat: any) => cat.category_id === (this.categoryId || 0))?.news_id;

        if (this.topNewsId) {
          this.getTopNews();
        }

        if (this.categoryId) {
          this.getCategoryNews();
        } else {
          this.getHomePageNews();
        }
      },
      (error) => {
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getTopNews() {
    const subscription = this.newsService.getSingleNews(this.topNewsId).subscribe(
      (result: any) => {
        this.topNews = result.data[0];
      },
      (error) => {
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getHomePageNews() {
    const body: any = {};
    if (this.topNewsId) {
      body.exclude = [this.topNewsId];
    }

    const subscription = this.newsService.getNewsByQuery(body, this.newsPerSection).subscribe(
      (result: any) => {
        this.allNews = result.data;

        for (const categoryId of Object.keys(this.newsByCategory)) {
          let excludeIds = this.allNews.map((news: any) => parseInt(news.id));

          if (this.topNewsId) {
            excludeIds = [...excludeIds, this.topNewsId];
          }

          const subscription = this.newsService
            .getNewsByQuery({ category_id: parseInt(categoryId), exclude: excludeIds }, this.newsPerSection)
            .subscribe(
              (result: any) => {
                this.newsByCategory[categoryId] = result.data;
              },
              (error) => {
                this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
              }
            );

          this.subscriptions.add(subscription);
        }
      },
      (error) => {
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getCategoryNews() {
    const body: any = { category_id: this.categoryId };
    if (this.topNewsId) {
      body.exclude = [this.topNewsId];
    }

    const subscription = this.newsService
      .getNewsByQuery(body, 50)
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

  getFeaturedNews() {
    const body: any = { featured: true };

    if (this.categoryId) {
      body.category_id = this.categoryId;
    }

    const subscription = this.newsService.getNewsByQuery(body, 20).subscribe(
      (result: any) => {
        this.featuredNews = result.data;
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
