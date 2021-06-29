import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';

import { HomeModule } from './home/home.module';
import { ListingModule } from "./listing/listing.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { JobsModule } from './jobs/jobs.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
import { NewsModule } from './news/news.module';
import { APIInterceptor } from './api-interceptor';


// change date format through out the site
export const DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,
    UserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MomentDateModule
  ],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
