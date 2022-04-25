import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageContactUsComponent } from './page-contact-us/page-contact-us.component';
import { PageReportIssueComponent } from './page-report-issue/page-report-issue.component';
import { PageFaqComponent } from './page-faq/page-faq.component';
import { PagePromoteComponent } from './page-promote/page-promote.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: 'contact-us',
    component: PageContactUsComponent,
  },
  {
    path: 'promote',
    component: PagePromoteComponent,
  },
  {
    path: 'report-issue',
    component: PageReportIssueComponent,
  },
  {
    path: 'faqs',
    component: PageFaqComponent,
  },
  {
    path: ':page-slug',
    component: PageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
