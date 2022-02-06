import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TravelDetailsComponent } from './travel-details/travel-details.component';
import { TravelListsComponent } from './travel-lists/travel-lists.component';


const routes: Routes = [
  {
    path: '',
    component: TravelListsComponent
  },
  {
    path: 'details/:travel_slug',
    component: TravelDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelsRoutingModule {}
