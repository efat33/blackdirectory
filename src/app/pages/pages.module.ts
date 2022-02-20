import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PageComponent } from './page/page.component';
import { PageContactUsComponent } from './page-contact-us/page-contact-us.component';
import { PagePromoteComponent } from './page-promote/page-promote.component';
import { PageFaqComponent } from './page-faq/page-faq.component';
import { PageEmailVerificationComponent } from './page-email-verification/page-email-verification.component';
import { PageUnsubscribeJobalertComponent } from './page-unsubscribe-jobalert/page-unsubscribe-jobalert.component';

@NgModule({
  declarations: [PageComponent, PageContactUsComponent, PagePromoteComponent, PageFaqComponent, PageEmailVerificationComponent, PageUnsubscribeJobalertComponent],
  imports: [CommonModule, SharedModule, PagesRoutingModule],
  providers: [],
})
export class PagesModule {}
