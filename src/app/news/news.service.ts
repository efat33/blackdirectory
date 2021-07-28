import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getNewsCategories(): Observable<any> {
    const url = `api/news/get-categories`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addNewsCategory(body: any): Observable<any> {
    const url = `api/news/add-category`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateNewsCategory(categoryId: number, body: any): Observable<any> {
    const url = `api/news/update-category/${categoryId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteNewsCategory(categoryId: number): Observable<any> {
    const url = `api/news/delete-category/${categoryId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }
}
