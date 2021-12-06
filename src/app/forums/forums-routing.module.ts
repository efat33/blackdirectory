import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllForumsComponent } from './all-forums/all-forums.component';
import { AllRepliesComponent } from './all-replies/all-replies.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';


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
    path: 'forum/:forum_slug',
    component: AllTopicsComponent
  },
  {
    path: 'topic/:topic_slug',
    component: AllRepliesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumsRoutingModule {}
