import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ForumsRoutingModule } from './forums-routing.module';
import { AllForumsComponent } from './all-forums/all-forums.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { AllRepliesComponent } from './all-replies/all-replies.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ForumUserProfileComponent } from './user-profile/user-profile.component';
import { ForumUserTopicsComponent } from './user-topics/user-topics.component';
import { ForumUserRepliesComponent } from './user-replies/user-replies.component';

@NgModule({
  declarations: [AllForumsComponent, AllTopicsComponent, AllRepliesComponent, ForumUserProfileComponent, ForumUserTopicsComponent, ForumUserRepliesComponent],
  imports: [CommonModule, SharedModule, ForumsRoutingModule, CKEditorModule],
  providers: [],
})
export class ForumsModule {}
