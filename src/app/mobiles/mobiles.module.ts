import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MobilesCategoryComponent } from './mobiles-category/mobiles-category.component';
import { MobilesLandingComponent } from './mobiles-landing/mobiles-landing.component';
import { MobilesRoutingModule } from './mobiles-routing.module';

@NgModule({
  declarations: [MobilesLandingComponent, MobilesCategoryComponent],
  imports: [CommonModule, SharedModule, MobilesRoutingModule],
  providers: [],
})
export class MobilesModule {}
