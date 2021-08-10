import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobilesCategoryComponent } from './mobiles-category/mobiles-category.component';
import { MobilesLandingComponent } from './mobiles-landing/mobiles-landing.component';


const routes: Routes = [
  {
    path: '',
    component: MobilesLandingComponent
  },
  {
    path: ':cat-slug',
    component: MobilesCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobilesRoutingModule {}
