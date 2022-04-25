import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PagesService } from '../pages.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SeoService } from 'src/app/shared/services/seo.service';

@Component({
  selector: 'app-page-faq',
  templateUrl: './page-faq.component.html',
  styleUrls: ['./page-faq.component.scss'],
})
export class PageFaqComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  faqs: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private seo: SeoService
  ) {}

  ngOnInit() {

    // setup SEO data
    this.seo.generateTags({
      title: 'FAQ', 
      description: 'FAQ', 
      image: 'https://www.blackdirectory.co.uk/assets/img/BD-LOGO.png',
      slug: 'faq',
      keywords: 'faq',
    });

    this.getFaqs();
  }

  getFaqs() {
    this.spinnerService.show();
    const subscription = this.pagesService.getFaqs().subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.faqs = result.data;
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
