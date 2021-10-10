import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getHeroSlides(): Observable<any> {
    const url = `api/common/get-hero-slides`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addHeroSlide(body: any): Observable<any> {
    const url = `api/common/add-hero-slide`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateHeroSlide(slideId: number, body: any): Observable<any> {
    const url = `api/common/update-hero-slide/${slideId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteHeroSlide(slideId: number): Observable<any> {
    const url = `api/common/delete-hero-slide/${slideId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

}
