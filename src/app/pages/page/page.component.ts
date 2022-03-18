import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PagesService } from '../pages.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SeoService } from 'src/app/shared/services/seo.service';
import { HelperService } from 'src/app/shared/helper.service';

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
    private seo: SeoService,
    private helperService: HelperService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pageSlug = this.route.snapshot.paramMap.get('page-slug');

      this.getPage();
    });
  }

  setSeoData(sData) {
    this.seo.generateTags({
      title: sData.meta_title || this.page.title, 
      description: sData.meta_desc || '', 
      image: this.helperService.defaultSeoImage || '',
      slug: this.pageSlug,
      keywords: sData.meta_keywords || '',
    });
  }

  getPage() {
    this.spinnerService.show();
    const subscription = this.pagesService.getPage(this.pageSlug).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.page = result.data[0];

        this.page.content = this.domSanitizer.bypassSecurityTrustHtml(this.page.content);

        this.setSeoData(this.page);
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
