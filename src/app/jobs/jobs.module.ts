import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { JobListingComponent } from './job-listing/job-listing.component';
import { JobDetailsComponent } from './job-details/job-details.component';


@NgModule({
  declarations: [JobListingComponent, JobDetailsComponent],
  imports: [CommonModule, SharedModule, JobsRoutingModule],
  providers: [],
})
export class JobsModule {}
