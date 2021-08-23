import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PagesService } from '../pages.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  pageSlug: string;
  page: any;

  constructor(
    private route: ActivatedRoute,
    private pagesService: PagesService,
    private spinnerService: SpinnerService,
    private domSanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pageSlug = this.route.snapshot.paramMap.get('page-slug');

      this.getPage();
    });
  }

  getPage() {
    this.spinnerService.show();
    const subscription = this.pagesService.getPage(this.pageSlug).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.page = result.data[0];

        this.page.content = this.domSanitizer.bypassSecurityTrustHtml(this.page.content);
      },
      (error) => {
        this.spinnerService.hide();
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
