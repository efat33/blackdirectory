import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { NewsRoutingModule } from './news-routing.module';
import { NewsListComponent } from './news-lists/news-lists.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NewsSearchComponent } from './news-search/news-search.component';



@NgModule({
  declarations: [NewsListComponent, NewsDetailsComponent, NewsSearchComponent],
  imports: [CommonModule, SharedModule, NewsRoutingModule],
  providers: [],
})
export class NewsModule {}
