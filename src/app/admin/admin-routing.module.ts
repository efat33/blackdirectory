import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { NewNewsComponent } from './news/new-news/new-news.component';
import { NewsCategoriesComponent } from './news/news-categories/news-categories.component';



const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'news-add', pathMatch: 'full' },
      { path: 'news-add', component:  NewNewsComponent},
      { path: 'news-categories', component:  NewsCategoriesComponent},
    ],
  }

];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
