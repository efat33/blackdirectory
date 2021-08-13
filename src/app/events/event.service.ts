import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { APIReponse } from "../shared/apiResponse";

@Injectable({
  providedIn: 'root',
})

export class EventService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) {}

    newEvent(body: any): Observable<APIReponse> {
      const url = 'api/events/new';
    
      return this.httpClient
        .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
        .pipe(map((body: APIReponse) => body));
    }

    newOrganiser(body: any): Observable<APIReponse> {
      const url = 'api/events/new-organiser';
    
      return this.httpClient
        .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
        .pipe(map((body: APIReponse) => body));
    }

    getCategories(): Observable<APIReponse> {
      const url = `api/events/categories`;
    
      return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
    }

    getOrganisers(): Observable<APIReponse> {
      const url = `api/events/organisers`;
    
      return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
    }

    getTags(): Observable<APIReponse> {
      const url = `api/events/tags`;
    
      return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
    }

    getEvent(slug): Observable<APIReponse> {
      const url = `api/events/get-event/${slug}`;
    
      return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
    }

    getRelatedEvents(id): Observable<APIReponse> {
      const url = `api/events/get-related-events/${id}`;
    
      return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
    }

    getUserTickets(id): Observable<APIReponse> {
      const url = `api/events/get-user-tickets/${id}`;
    
      return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
    }

    getUserRsvp(id): Observable<APIReponse> {
      const url = `api/events/get-user-rsvp/${id}`;
    
      return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
    }

    rsvpApply(body: any): Observable<APIReponse> {
      const url = 'api/events/rsvp-apply';
    
      return this.httpClient
        .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
        .pipe(map((body: APIReponse) => body));
    }

}    