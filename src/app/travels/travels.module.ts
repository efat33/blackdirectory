import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TravelsRoutingModule } from './travels-routing.module';
import { TravelListsComponent } from './travel-lists/travel-lists.component';
import { TravelDetailsComponent } from './travel-details/travel-details.component';



@NgModule({
  declarations: [TravelListsComponent, TravelDetailsComponent],
  imports: [CommonModule, SharedModule, TravelsRoutingModule],
  providers: [],
})
export class TravelModule {}
