import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageEmailVerificationComponent } from './pages/page-email-verification/page-email-verification.component';
import { PageUnsubscribeJobalertComponent } from './pages/page-unsubscribe-jobalert/page-unsubscribe-jobalert.component';
import { AdminGuard, AuthGuard } from './shared/route-guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'verify/:verification-key',
    component: PageEmailVerificationComponent,
  },
  {
    path: 'unsubscribe-job-alert/:id/:key',
    component: PageUnsubscribeJobalertComponent,
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then((m) => m.NewsModule),
  },
  {
    path: 'travels',
    loadChildren: () => import('./travels/travels.module').then((m) => m.TravelModule),
  },
  {
    path: 'finance',
    loadChildren: () => import('./finance/finance.module').then((m) => m.FinanceModule),
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then((m) => m.EventsModule),
  },
  {
    path: 'jobs',
    loadChildren: () => import('./jobs/jobs.module').then((m) => m.JobsModule),
  },
  {
    path: 'listing',
    loadChildren: () => import('./listing/listing.module').then((m) => m.ListingModule),
  },
  {
    path: 'mobiles',
    loadChildren: () => import('./mobiles/mobiles.module').then((m) => m.MobilesModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then((m) => m.ShopModule),
  },
  {
    path: 'forums',
    loadChildren: () => import('./forums/forums.module').then((m) => m.ForumsModule),
  },
  {
    path: 'deals',
    loadChildren: () => import('./deals/deals.module').then((m) => m.DealsModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    canLoad: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
