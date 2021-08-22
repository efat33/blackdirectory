import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NewNewsComponent } from './news/new-news/new-news.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { NewsCategoriesComponent } from './news/news-categories/news-categories.component';
import { AddNewsCategoryModalComponent } from './news/news-categories/add-news-category-modal/add-news-category-modal';
import { ManageNewsComponent } from './news/manage-news/manage-news.component';
import { TopNewsComponent } from './news/top-news/top-news.component';
import { JobSectorsComponent } from './jobs/job-sectors/job-sectors.component';
import { AddJobSectorModalComponent } from './jobs/job-sectors/add-job-sector-modal/add-job-sector-modal';
import { AddListingCategoryModalComponent } from './listing/listing-categories/add-listing-category-modal/add-listing-category-modal';
import { ListingCategoriesComponent } from './listing/listing-categories/listing-categories.component';
import { NewMobileComponent } from './mobiles/new-mobile/new-mobile.component';
import { ManageMobilesComponent } from './mobiles/manage-mobiles/manage-mobiles.component';
import { MobileProvidersComponent } from './mobiles/mobile-providers/mobile-providers.component';
import { AddMobileProviderModalComponent } from './mobiles/mobile-providers/add-mobile-providers-modal/add-mobile-providers-modal';
import { ListingClaimsComponent } from './listing/listing-claims/listing-claims.component';
import { ManagePagesComponent } from './pages/manage-pages/manage-pages.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ManageFaqsComponent } from './pages/manage-faqs/manage-faqs.component';
import { AddFaqModalComponent } from './pages/manage-faqs/add-faq-modal/add-faq-modal';

@NgModule({
  declarations: [
    AdminComponent,
    NewNewsComponent,
    NewsCategoriesComponent,
    AddNewsCategoryModalComponent,
    ManageNewsComponent,
    TopNewsComponent,
    JobSectorsComponent,
    AddJobSectorModalComponent,
    ListingCategoriesComponent,
    AddListingCategoryModalComponent,
    NewMobileComponent,
    ManageMobilesComponent,
    MobileProvidersComponent,
    AddMobileProviderModalComponent,
    ListingClaimsComponent,
    ManagePagesComponent,
    NewPageComponent,
    ManageFaqsComponent,
    AddFaqModalComponent
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule, CKEditorModule]
})
export class AdminModule {}
