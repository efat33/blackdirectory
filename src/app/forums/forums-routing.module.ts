import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllForumsComponent } from './all-forums/all-forums.component';
import { AllRepliesComponent } from './all-replies/all-replies.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { ForumUserProfileComponent } from './user-profile/user-profile.component';
import { ForumUserRepliesComponent } from './user-replies/user-replies.component';
import { ForumUserTopicsComponent } from './user-topics/user-topics.component';


const routes: Routes = [
  {
    path: '',
    component: AllForumsComponent
  },
  {
    path: 'all',
    component: AllForumsComponent
  },
  {
    path: 'category/:cat_id',
    component: AllForumsComponent
  },
  {
    path: 'forum/:forum_slug',
    component: AllTopicsComponent
  },
  {
    path: 'topic/:topic_slug',
    component: AllRepliesComponent
  },
  {
    path: 'topics/category/:cat_id',
    component: AllTopicsComponent
  },
  {
    path: 'users/:username',
    component: ForumUserProfileComponent
  },
  {
    path: 'users/:username/topics',
    component: ForumUserTopicsComponent
  },
  {
    path: 'users/:username/replies',
    component: ForumUserRepliesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumsRoutingModule {}
