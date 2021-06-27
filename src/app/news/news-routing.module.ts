import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NewsListComponent } from './news-lists/news-lists.component';


const routes: Routes = [
  {
    path: 'news',
    component: NewsListComponent
  },
  {
    path: 'news/:cat-slug',
    component: NewsListComponent
  },
  {
    path: 'news/details/:news-slug',
    component: NewsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
