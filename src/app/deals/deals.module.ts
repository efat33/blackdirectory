import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DealsRoutingModule } from './deals-routing.module';
import { DealDetailsComponent } from './deals-details/deals-details.component';
import { DealsListComponent } from './deals-list/deals-list.component';

@NgModule({
  declarations: [DealsListComponent, DealDetailsComponent],
  imports: [CommonModule, SharedModule, DealsRoutingModule],
  providers: [],
})
export class DealsModule {}
