import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['../news-lists/news-lists.component.scss', './news-details.component.scss'],
})
export class NewsDetailsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  featuredNews: any;
  news: any;
  newsSlug: string;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private newsService: NewsService,
    private snackbar: SnackBarService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.newsSlug = this.route.snapshot.paramMap.get('news-slug');

    this.getNews();
    this.getFeaturedNews();
  }

  getNews() {
    this.spinnerService.show();
    const subscription = this.newsService.getNewsByQuery({ slug: this.newsSlug }, 1).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.news = result.data[0];
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  getFeaturedNews() {
    const body: any = { featured: true };

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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
