import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { APIReponse } from '../shared/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient, private router: Router) {}

  newEvent(body: any): Observable<APIReponse> {
    const url = 'api/events/new';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  editEvent(body: any): Observable<APIReponse> {
    const url = 'api/events/edit';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  searchEvent(body: any): Observable<APIReponse> {
    const url = 'api/events/search-events';

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

  updateOrganizer(organizerId: number, body: any): Observable<any> {
    const url = `api/events/update-organiser/${organizerId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteOrganizer(organizerId: number): Observable<any> {
    const url = `api/events/delete-organiser/${organizerId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getCategories(): Observable<APIReponse> {
    const url = `api/events/categories`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  addCategory(body: any): Observable<any> {
    const url = `api/events/new-category`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateCategory(categoryId: number, body: any): Observable<any> {
    const url = `api/events/update-category/${categoryId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteCategory(categoryId: number): Observable<any> {
    const url = `api/events/delete-category/${categoryId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getOrganisers(): Observable<APIReponse> {
    const url = `api/events/organisers`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  getTags(): Observable<APIReponse> {
    const url = `api/events/tags`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  addTag(body: any): Observable<any> {
    const url = `api/events/new-tag`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateTag(tagId: number, body: any): Observable<any> {
    const url = `api/events/update-tag/${tagId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteTag(tagId: number): Observable<any> {
    const url = `api/events/delete-tag/${tagId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getEvent(slug, edit = false): Observable<APIReponse> {
    let url = '';
    if (edit) {
      url = `api/events/get-event/1/${slug}`;
    } else {
      url = `api/events/get-event/${slug}`;
    }

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

  addNewComment(body: any) {
    const url = `api/events/add-comment`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteEventComment(commentId: number): Observable<any> {
    const url = `api/events/delete-comment/${commentId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  updateEventComment(commentId: number, body: any): Observable<any> {
    const url = `api/events/update-comment/${commentId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  createStripeCheckoutSession(body: any): Observable<any> {
    const url = `api/events/create-checkout-session`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }
}
