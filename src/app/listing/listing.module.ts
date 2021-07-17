import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListingRoutingModule } from './listing-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ListingSearchComponent } from './listing-search/listing-search.component';
import { ListingDetailsComponent } from "./listing-details/listing-details.component";
import { ListingPlanComponent } from "./listing-plan/listing-plan.component";
import { ListingNewComponent } from "./listing-new/listing-new.component";
import { ListingEditComponent } from './listing-edit/listing-edit.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [ListingSearchComponent, ListingDetailsComponent, ListingPlanComponent, ListingNewComponent, 
      ListingEditComponent],
  imports: [CommonModule, SharedModule, ListingRoutingModule, CKEditorModule]
})
export class ListingModule {}
