import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NewNewsComponent } from './news/new-news/new-news.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { NewsCategoriesComponent } from './news/news-categories/news-categories.component';
import { AddNewsCategoryModalComponent } from './news/news-categories/add-news-category-modal/add-news-category-modal';
import { ManageNewsComponent } from './news/manage-news/manage-news.component';
import { TopNewsComponent } from './news/top-news/top-news.component';
import { JobSectorsComponent } from './jobs/job-sectors/job-sectors.component';
import { AddJobSectorModalComponent } from './jobs/job-sectors/add-job-sector-modal/add-job-sector-modal';

@NgModule({
  declarations: [
    AdminComponent,
    NewNewsComponent,
    NewsCategoriesComponent,
    AddNewsCategoryModalComponent,
    ManageNewsComponent,
    TopNewsComponent,
    JobSectorsComponent,
    AddJobSectorModalComponent
  ],
  imports: [CommonModule, SharedModule, AdminRoutingModule, CKEditorModule]
})
export class AdminModule {}
