import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealDetailsComponent } from './deals-details/deals-details.component';
import { DealsListComponent } from './deals-list/deals-list.component';


const routes: Routes = [
  {
    path: '',
    component: DealsListComponent
  },
  {
    path: ':dealer-slug',
    component: DealsListComponent
  },
  {
    path: 'details/:deal-slug',
    component: DealDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealsRoutingModule {}
