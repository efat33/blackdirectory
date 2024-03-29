import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobListingComponent } from './job-listing/job-listing.component';


const routes: Routes = [
  {
    path: '',
    component: JobListingComponent
  },
  {
    path: 'details/:job-slug',
    component: JobDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule {}
