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

  getNews(): Observable<any> {
    const url = `api/news/get-news`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getNewsByQuery(filter: any = {}, limit: number): Observable<any> {
    const url = `api/news/get-news?limit=${limit}`;

    return this.httpClient.post<any>(url, JSON.stringify(filter), this.headerOptions);
  }

  getSingleNews(newsIdOrSlug: any): Observable<any> {
    const url = `api/news/get-news/${newsIdOrSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addNews(body: any): Observable<any> {
    const url = `api/news/add-news`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateNews(newsId: number, body: any): Observable<any> {
    const url = `api/news/update-news/${newsId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteNews(newsId: number): Observable<any> {
    const url = `api/news/delete-news/${newsId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getNewsCategories(): Observable<any> {
    const url = `api/news/get-categories`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getNewsCategoriesList(): Observable<any> {
    const url = `api/news/get-categories-list`;

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

  getTopNews(): Observable<any> {
    const url = `api/news/get-top-news`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  updateTopNews(body: any): Observable<any> {
    const url = `api/news/update-top-news`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  addNewComment(body: any) {
    const url = `api/news/add-comment`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteNewsComment(commentId: number): Observable<any> {
    const url = `api/news/delete-comment/${commentId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  updateNewsComment(commentId: number, body: any): Observable<any> {
    const url = `api/news/update-comment/${commentId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getUserCommentLikes(userId: string | number): Observable<any> {
    const url = `api/news/get-comment-likes/${userId}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  updateCommentLike(body: any) {
    const url = `api/news/update-comment-like/`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }
}
