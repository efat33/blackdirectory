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
import { AdminGuard } from '../shared/route-guards/auth-guard.service';
import { ListingClaimsComponent } from './listing/listing-claims/listing-claims.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ManagePagesComponent } from './pages/manage-pages/manage-pages.component';
import { ManageFaqsComponent } from './pages/manage-faqs/manage-faqs.component';
import { FavoriteListingsComponent } from '../dashboard/favorite-listings/favorite-listings.component';
import { ListingsComponent } from '../dashboard/listings/listings.component';
import { EventsComponent } from '../dashboard/events/events.component';
import { ManageJobComponent } from '../dashboard/manage-job/manage-job.component';
import { ManageJobsComponent } from '../dashboard/manage-jobs/manage-jobs.component';
import { NewJobComponent } from '../dashboard/new-job/new-job.component';
import { ProductResolver } from '../dashboard/products-edit/product-edit.resolver';
import { ProductsEditComponent } from '../dashboard/products-edit/products-edit.component';
import { ProductsNewComponent } from '../dashboard/products-new/products-new.component';
import { ProductsComponent } from '../dashboard/products/products.component';
import { ProductCategoriesComponent } from './products/product-categories/product-categories.component';
import { ProductCategoryOptionsComponent } from './products/product-category-options/product-category-options.component';
import { AllOrdersListComponent } from './products/orders/orders.component';
import { AllWithdrawRequestsComponent } from './products/withdraw-requests/withdraw-requests.component';
import { HeroSliderComponent } from './hero-slider/hero-slider.component';
import { EventCategoriesComponent } from './events/event-categories/event-categories.component';
import { EventTagsComponent } from './events/event-tags/event-tags.component';
import { EventOrganizersComponent } from './events/event-organizers/event-organizers.component';
import { DealersComponent } from './deals/dealers/dealers.component';
import { NewDealComponent } from './deals/new-deal/new-deal.component';
import { ManageDealsComponent } from './deals/manage-deals/manage-deals.component';
import { ManageUsersComponent } from './users/manage-users/manage-users.component';
import { DashboardProfileComponent } from '../dashboard/profile/dashboard-profile.component';
import { AllForumsComponent } from '../dashboard/forums/forums.component';
import { NewForumComponent } from '../dashboard/forums-new/forums-new.component';
import { AllTopicsComponent } from '../dashboard/topics/topics.component';
import { NewTopicComponent } from '../dashboard/topics-new/topics-new.component';
import { AllRepliesComponent } from '../dashboard/replies/replies.component';
import { NewReplyComponent } from '../dashboard/reply-new/reply-new.component';
import { ForumCategoriesComponent } from './forums/forum-categories/forum-categories.component';
import { NewTravelComponent } from './travels/new-travel/new-travel.component';
import { ManageTravelComponent } from './travels/manage-travel/manage-travel.component';
import { NewFinanceComponent } from './finance/new-finance/new-finance.component';
import { ManageFinanceComponent } from './finance/manage-finance/manage-finance.component';
import { UserRequestsComponent } from './users/user-requests/user-requests.component';
import { DeactivatedUsersComponent } from './users/deactivated-users/deactivated-users.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
    children: [
      { path: '', redirectTo: 'news-add', pathMatch: 'full' },

      { path: 'listings', component: ListingsComponent },
      { path: 'favorite-listings', component: FavoriteListingsComponent },

      { path: 'forums/all', component: AllForumsComponent },
      { path: 'forums/new', component: NewForumComponent },
      { path: 'forums/forum/edit/:forum_id', component: NewForumComponent },

      { path: 'forum-categories', component: ForumCategoriesComponent },

      { path: 'topics/all', component: AllTopicsComponent },
      { path: 'topics/new', component: NewTopicComponent },
      { path: 'topics/topic/edit/:topic_id', component: NewTopicComponent },

      { path: 'replies/all', component: AllRepliesComponent },
      { path: 'forums/reply/edit/:reply_id', component: NewReplyComponent },

      { path: 'events', component: EventsComponent },
      { path: 'event-categories', component: EventCategoriesComponent },
      { path: 'event-tags', component: EventTagsComponent },
      { path: 'event-organizers', component: EventOrganizersComponent },

      { path: 'manage-job/:job_id', component: ManageJobComponent },
      { path: 'manage-jobs', component: ManageJobsComponent },
      { path: 'new-job', component: NewJobComponent },
      { path: 'edit-job/:job_id', component: NewJobComponent },

      { path: 'news-add', component: NewNewsComponent },
      { path: 'news-edit/:news_id', component: NewNewsComponent },
      { path: 'news-all', component: ManageNewsComponent },
      { path: 'news-categories', component: NewsCategoriesComponent },
      { path: 'top-news', component: TopNewsComponent },

      { path: 'new-travel', component: NewTravelComponent },
      { path: 'edit-travel/:travel_id', component: NewTravelComponent },
      { path: 'all-travels', component: ManageTravelComponent },

      { path: 'new-finance', component: NewFinanceComponent },
      { path: 'edit-finance/:finance_id', component: NewFinanceComponent },
      { path: 'all-finance', component: ManageFinanceComponent },

      { path: 'job-sectors', component: JobSectorsComponent },

      { path: 'listing-categories', component: ListingCategoriesComponent },
      { path: 'listing-claims', component: ListingClaimsComponent },

      { path: 'mobiles-add', component: NewMobileComponent },
      { path: 'mobiles-edit/:mobile_id', component: NewMobileComponent },
      { path: 'mobiles-all', component: ManageMobilesComponent },
      { path: 'mobiles-providers', component: MobileProvidersComponent },

      { path: 'deals-add', component: NewDealComponent },
      { path: 'deals-edit/:deal_id', component: NewDealComponent },
      { path: 'deals-all', component: ManageDealsComponent },
      { path: 'dealers', component: DealersComponent },

      { path: 'page-add', component: NewPageComponent },
      { path: 'page-edit/:page_slug', component: NewPageComponent },
      { path: 'page-all', component: ManagePagesComponent },
      { path: 'manage-faqs', component: ManageFaqsComponent },

      { path: 'products', component: ProductsComponent },
      { path: 'product-new', component: ProductsNewComponent },
      { path: 'product-edit/:slug', component: ProductsEditComponent, resolve: { product: ProductResolver } },
      { path: 'product-categories', component: ProductCategoriesComponent },
      { path: 'product-options', component: ProductCategoryOptionsComponent },
      { path: 'all-orders', component: AllOrdersListComponent },
      { path: 'withdraw-requests', component: AllWithdrawRequestsComponent },

      { path: 'hero-slider', component: HeroSliderComponent },

      { path: 'users', component: ManageUsersComponent },
      { path: 'users-edit/:id', component: DashboardProfileComponent },
      { path: 'users-request', component: UserRequestsComponent },
      { path: 'users-deactivated', component: DeactivatedUsersComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
