import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getTravels(): Observable<any> {
    const url = `api/travels/get-travels`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getTravelsByQuery(filter: any = {}): Observable<any> {
    const url = `api/travels/get-travels`;

    return this.httpClient.post<any>(url, JSON.stringify(filter), this.headerOptions);
  }

  getSingleTravel(travelIdOrSlug: any): Observable<any> {
    const url = `api/travels/get-travel/${travelIdOrSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addTravel(body: any): Observable<any> {
    const url = `api/travels/add-travel`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateTravel(travelId: number, body: any): Observable<any> {
    const url = `api/travels/update-travel/${travelId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteTravel(travelId: number): Observable<any> {
    const url = `api/travels/delete-travel/${travelId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }


}
