import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NewsListComponent } from './news-lists/news-lists.component';
import { NewsSearchComponent } from './news-search/news-search.component';


const routes: Routes = [
  {
    path: '',
    component: NewsListComponent
  },
  {
    path: 'search',
    component: NewsSearchComponent
  },
  {
    path: ':cat-slug',
    component: NewsListComponent
  },
  {
    path: 'details/:news-slug',
    component: NewsDetailsComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
