import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DashboardProfileComponent } from "./profile/dashboard-profile.component";
import { DashboardComponent } from './dashboard.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { FavoriteJobsComponent } from './favorite-jobs/favorite-jobs.component';
import { SavedJobsComponent } from './saved-jobs/saved-jobs.component';
import { AllApplicantsComponent } from './all-applicants/all-applicants.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';
import { NewJobComponent } from './new-job/new-job.component';
import { UserFollowerComponent } from './followers/followers.component';
import { UserFollowingComponent } from './following/following.component';
import { ChangePasswordComponent } from './change-password/change-password.component';



const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "profile", pathMatch: "full" },
      { path: 'profile', component:  DashboardProfileComponent},
      { path: 'applied-jobs', component:  AppliedJobsComponent},
      { path: 'favorite-jobs', component:  FavoriteJobsComponent},
      { path: 'saved-jobs', component:  SavedJobsComponent},
      { path: 'all-applicants', component:  AllApplicantsComponent},
      { path: 'manage-jobs', component:  ManageJobsComponent},
      { path: 'new-job', component:  NewJobComponent},
      { path: 'followers', component:  UserFollowerComponent},
      { path: 'following', component:  UserFollowingComponent},
      { path: 'change-password', component:  ChangePasswordComponent},
    ],
  }
  
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
