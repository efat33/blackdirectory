import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardProfileComponent } from "./profile/dashboard-profile.component";
import { DashboardComponent } from "./dashboard.component";
import { AllApplicantsComponent } from './all-applicants/all-applicants.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { FavoriteJobsComponent } from './favorite-jobs/favorite-jobs.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';
import { NewJobComponent } from './new-job/new-job.component';
import { SavedJobsComponent } from './saved-jobs/saved-jobs.component';
import { UserFollowerComponent } from './followers/followers.component';
import { UserFollowingComponent } from './following/following.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ManageJobComponent } from './manage-job/manage-job.component';


@NgModule({
  declarations: [
    DashboardProfileComponent, DashboardComponent, AllApplicantsComponent, AppliedJobsComponent,
    FavoriteJobsComponent, ManageJobsComponent, NewJobComponent, SavedJobsComponent, UserFollowerComponent,
    UserFollowingComponent, ChangePasswordComponent, ManageJobComponent
  ],
  imports: [CommonModule, SharedModule, DashboardRoutingModule, CKEditorModule]
})
export class DashboardModule {}
