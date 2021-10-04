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
import { StoreResolver } from './store-settings/store-settings.resolver';
import { ListingsComponent } from './listings/listings.component';
import { EventsComponent } from './events/events.component';
import { OrderResolver } from '../shared/components/order-details/order.resolver';
import { OrderComponent } from './order/order.component';
import { WithdrawResolver } from './withdraw/withdraw.resolver';
import { FavoriteListingsComponent } from './favorite-listings/favorite-listings.component';
import { OrdersResolver } from './orders/orders.resolver';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ShippingComponent } from './shipping/shipping.component';
import { AuthVerifiedGuard } from '../shared/route-guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: DashboardProfileComponent },
      { path: 'applied-jobs', component: AppliedJobsComponent },
      { path: 'favorite-jobs', component: FavoriteJobsComponent },
      { path: 'saved-candidates', component: SavedCandidatesComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'all-applicants', component: AllApplicantsComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'manage-job/:job_id', component: ManageJobComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'manage-jobs', component: ManageJobsComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'new-job', component: NewJobComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'edit-job/:job_id', component: NewJobComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'followers', component: UserFollowerComponent },
      { path: 'following', component: UserFollowingComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'packages', component: JobPackagesComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'packages/return', component: JobPackagesReturnComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'messages', component: MessagesComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'listings', component: ListingsComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'favorite-listings', component: FavoriteListingsComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'events', component: EventsComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'products', component: ProductsComponent, canActivate: [AuthVerifiedGuard] },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'products/new', component: ProductsNewComponent, canActivate: [AuthVerifiedGuard] },
      {
        path: 'products/edit/:slug',
        component: ProductsEditComponent,
        canActivate: [AuthVerifiedGuard],
        resolve: { product: ProductResolver },
      },
      {
        path: 'orders/:side',
        component: OrdersComponent,
        canActivate: [AuthVerifiedGuard],
        resolve: { orders: OrdersResolver },
      },
      { path: 'order/:id', component: OrderComponent, canActivate: [AuthVerifiedGuard], resolve: { order: OrderResolver } },
      {
        path: 'withdraw',
        component: WithdrawComponent,
        canActivate: [AuthVerifiedGuard],
        resolve: { data: WithdrawResolver },
      },
      { path: 'shipping', component: ShippingComponent, canActivate: [AuthVerifiedGuard] },
      {
        path: 'store-settings',
        component: StoreSettingsComponent,
        canActivate: [AuthVerifiedGuard],
        resolve: { store: StoreResolver },
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
