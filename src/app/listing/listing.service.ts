import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { APIReponse } from "../shared/apiResponse";

@Injectable({
  providedIn: 'root',
})

export class ListingService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) {}


  addListing(body: any): Observable<APIReponse> {
    const url = 'api/listings/add-listing';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  updateListing(body: any): Observable<APIReponse> {
    const url = 'api/listings/update-listing';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  getListing(slug): Observable<APIReponse> {
    const url = `api/listings/${slug}`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  publishListing(body: any): Observable<APIReponse> {
    const url = 'api/listings/publish-listing';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  newReview(body: any): Observable<APIReponse> {
    const url = 'api/listings/new-review';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  editReview(body: any): Observable<APIReponse> {
    const url = 'api/listings/edit-review';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  getReviews(id): Observable<APIReponse> {
    const url = `api/listings/get-reviews/${id}`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  deleteReview(id): Observable<APIReponse> {
    const url = `api/listings/delete-review/${id}`;
  
    return this.httpClient.delete<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  updateReviewLike(body: any): Observable<APIReponse> {
    const url = 'api/listings/update-review-like';
  
    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  submitComment(body: any): Observable<APIReponse> {
    const url = 'api/listings/submit-comment';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  deleteComment(id): Observable<APIReponse> {
    const url = `api/listings/delete-comment/${id}`;
  
    return this.httpClient.delete<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }
  
  
}


