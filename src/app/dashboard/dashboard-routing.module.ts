import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DashboardProfileComponent } from './profile/dashboard-profile.component';
import { DashboardComponent } from './dashboard.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { FavoriteJobsComponent } from './favorite-jobs/favorite-jobs.component';
import { SavedCandidatesComponent } from './saved-candidates/saved-candidates.component';
import { AllApplicantsComponent } from './all-applicants/all-applicants.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';
import { NewJobComponent } from './new-job/new-job.component';
import { UserFollowerComponent } from './followers/followers.component';
import { UserFollowingComponent } from './following/following.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ManageJobComponent } from './manage-job/manage-job.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { JobPackagesComponent } from './job-packages/job-packages.component';
import { JobPackagesReturnComponent } from './job-packages/job-packages-return/job-packages-return.component';
import { MessagesComponent } from './messages/messages.component';
import { ProductsComponent } from './products/products.component';
import { ProductsNewComponent } from './products-new/products-new.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { StoreSettingsComponent } from './store-settings/store-settings.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductResolver } from './products-edit/product-edit.resolver';
import { ListingsComponent } from './listings/listings.component';
import { EventsComponent } from './events/events.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: DashboardProfileComponent },
      { path: 'applied-jobs', component: AppliedJobsComponent },
      { path: 'favorite-jobs', component: FavoriteJobsComponent },
      { path: 'saved-candidates', component: SavedCandidatesComponent },
      { path: 'all-applicants', component: AllApplicantsComponent },
      { path: 'manage-job/:job_id', component: ManageJobComponent },
      { path: 'manage-jobs', component: ManageJobsComponent },
      { path: 'new-job', component: NewJobComponent },
      { path: 'edit-job/:job_id', component: NewJobComponent },
      { path: 'followers', component: UserFollowerComponent },
      { path: 'following', component: UserFollowingComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'packages', component: JobPackagesComponent },
      { path: 'packages/return', component: JobPackagesReturnComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'listings', component: ListingsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/new', component: ProductsNewComponent },
      { path: 'products/edit/:slug', component: ProductsEditComponent, resolve: { product: ProductResolver } },
      { path: 'orders', component: OrdersComponent },
      { path: 'withdraw', component: WithdrawComponent },
      { path: 'store-settings', component: StoreSettingsComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
