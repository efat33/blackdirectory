import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinanceDetailsComponent } from './finance-details/finance-details.component';
import { FinanceListsComponent } from './finance-lists/finance-lists.component';


const routes: Routes = [
  {
    path: '',
    component: FinanceListsComponent
  },
  {
    path: 'details/:finance_slug',
    component: FinanceDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
