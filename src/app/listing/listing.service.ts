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

  getListings(params): Observable<APIReponse> {
    const url = `api/listings/get-listings/${params}`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  publishListing(body: any): Observable<APIReponse> {
    const url = 'api/listings/publish-listing';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  deleteListing(id): Observable<APIReponse> {
    const url = `api/listings/delete-listing/${id}`;

    return this.httpClient.delete<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  searchListing(body: any): Observable<APIReponse> {
    const url = 'api/listings/search-listing';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  getFavorites(): Observable<APIReponse> {
    const url = `api/listings/favorites`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  getFavoriteListings(body: any): Observable<APIReponse> {
    const url = 'api/listings/favorite-listings';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  updateFavorite(id): Observable<APIReponse> {
    const url = `api/listings/update-favorite/${id}`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  getCategories(): Observable<APIReponse> {
    const url = `api/listings/categories`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  updateView(id): Observable<APIReponse> {
    const url = `api/listings/update-view/${id}`;

    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
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

  getListingCategories(): Observable<any> {
    const url = `api/listings/get-categories`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addListingCategory(body: any): Observable<any> {
    const url = `api/listings/add-category`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateListingCategory(categoryId: number, body: any): Observable<any> {
    const url = `api/listings/update-category/${categoryId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteListingCategory(categoryId: number): Observable<any> {
    const url = `api/listings/delete-category/${categoryId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  newClaim(body: any): Observable<APIReponse> {
    const url = 'api/listings/new-claim';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  getTrendingCategories(): Observable<APIReponse> {
    const url = `api/listings/trending-categories`;
  
    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  getClaims(body: any): Observable<APIReponse> {
    const url = 'api/listings/get-claims';
  
    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  approveClaim(id): Observable<APIReponse> {
    const url = `api/listings/approve-claim/${id}`;
  
    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  deleteClaim(id): Observable<APIReponse> {
    const url = `api/listings/delete-claim/${id}`;
  
    return this.httpClient.get<APIReponse>(url).pipe(map((body: APIReponse) => body));
  }

  getProducts(body: any): Observable<APIReponse> {
    const url = 'api/shop/products';
  
    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

}


