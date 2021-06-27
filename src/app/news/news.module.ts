import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { NewsRoutingModule } from './news-routing.module';
import { NewsListComponent } from './news-lists/news-lists.component';



@NgModule({
  declarations: [NewsListComponent],
  imports: [CommonModule, SharedModule, NewsRoutingModule],
  providers: [],
})
export class NewsModule {}
