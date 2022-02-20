import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceListsComponent } from './finance-lists/finance-lists.component';
import { FinanceDetailsComponent } from './finance-details/finance-details.component';



@NgModule({
  declarations: [FinanceListsComponent, FinanceDetailsComponent],
  imports: [CommonModule, SharedModule, FinanceRoutingModule],
  providers: [],
})
export class FinanceModule {}
