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
import { ProductCategoriesComponent } from './products/product-categories/product-categories.component';
import { AddProductCategoryModalComponent } from './products/product-categories/add-product-category-modal/add-product-category-modal';
import { ProductCategoryOptionsComponent } from './products/product-category-options/product-category-options.component';
import { AddProductCategoryOptionModalComponent } from './products/product-category-options/add-product-category-option-modal/add-product-category-option-modal';
import { AddProductOptionChoiceModalComponent } from './products/product-category-options/add-product-option-choice-modal/add-product-option-choice-modal';
import { AssignCategoryOptionsModalComponent } from './products/product-categories/assign-option-modal/assign-option-modal';
import { AllOrdersListComponent } from './products/orders/orders.component';
import { AllWithdrawRequestsComponent } from './products/withdraw-requests/withdraw-requests.component';
import { HeroSliderComponent } from './hero-slider/hero-slider.component';
import { AddHeroSlidesModalComponent } from './hero-slider/add-hero-slides-modal/add-hero-slides-modal';
import { EventCategoriesComponent } from './events/event-categories/event-categories.component';
import { AddEventCategoryModalComponent } from './events/event-categories/add-event-category-modal/add-event-category-modal';
import { EventTagsComponent } from './events/event-tags/event-tags.component';
import { AddEventTagModalComponent } from './events/event-tags/add-event-tag-modal/add-event-tag-modal';
import { EventOrganizersComponent } from './events/event-organizers/event-organizers.component';
import { AddEventOrganizerModalComponent } from './events/event-organizers/add-event-organizer-modal/add-event-organizer-modal';

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
    AddFaqModalComponent,
    ProductCategoriesComponent,
    AddProductCategoryModalComponent,
    ProductCategoryOptionsComponent,
    AddProductCategoryOptionModalComponent,
    AddProductOptionChoiceModalComponent,
    AssignCategoryOptionsModalComponent,
    AllOrdersListComponent,
    AllWithdrawRequestsComponent,
    HeroSliderComponent,
    AddHeroSlidesModalComponent,
    EventCategoriesComponent,
    AddEventCategoryModalComponent,
    EventTagsComponent,
    AddEventTagModalComponent,
    EventOrganizersComponent,
    AddEventOrganizerModalComponent
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule, CKEditorModule]
})
export class AdminModule {}
