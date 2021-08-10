import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { NewNewsComponent } from './news/new-news/new-news.component';
import { NewsCategoriesComponent } from './news/news-categories/news-categories.component';
import { ManageNewsComponent } from './news/manage-news/manage-news.component';
import { TopNewsComponent } from './news/top-news/top-news.component';
import { JobSectorsComponent } from './jobs/job-sectors/job-sectors.component';
import { ListingCategoriesComponent } from './listing/listing-categories/listing-categories.component';
import { NewMobileComponent } from './mobiles/new-mobile/new-mobile.component';
import { ManageMobilesComponent } from './mobiles/manage-mobiles/manage-mobiles.component';
import { MobileProvidersComponent } from './mobiles/mobile-providers/mobile-providers.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'news-add', pathMatch: 'full' },
      { path: 'news-add', component: NewNewsComponent },
      { path: 'news-edit/:news_id', component: NewNewsComponent },
      { path: 'news-all', component: ManageNewsComponent },
      { path: 'news-categories', component: NewsCategoriesComponent },
      { path: 'top-news', component: TopNewsComponent },

      { path: 'job-sectors', component: JobSectorsComponent },

      { path: 'listing-categories', component: ListingCategoriesComponent },

      { path: 'mobiles-add', component: NewMobileComponent },
      { path: 'mobiles-edit/:mobile_id', component: NewMobileComponent },
      { path: 'mobiles-all', component: ManageMobilesComponent },
      { path: 'mobiles-providers', component: MobileProvidersComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
