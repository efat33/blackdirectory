import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EventsAllComponent } from './all/events-all.component';
import { EventDetailsComponent } from './details/event-details.component';
import { NewEventComponent } from './new/new-event.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [EventsAllComponent, EventDetailsComponent, NewEventComponent],
  imports: [CommonModule, SharedModule, EventsRoutingModule, CKEditorModule]
})
export class EventsModule {}
