import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getForums(body: any): Observable<any> {
    const url = `api/forums/get-forums`;

    return this.httpClient
      .post<any>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: any) => body));
  }

  getSingleForum(forumIdOrSlug: any): Observable<any> {
    const url = `api/forums/get-forum/${forumIdOrSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addForum(body: any): Observable<any> {
    const url = `api/forums/add-forum`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateForum(forumId: number, body: any): Observable<any> {
    const url = `api/forums/update-forum/${forumId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteForum(forumId: number): Observable<any> {
    const url = `api/forums/delete-forum/${forumId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }


  /**
   * Topic
   * */ 

  addTopic(body: any): Observable<any> {
    const url = `api/topics/add-topic`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getTopics(body: any): Observable<any> {
    const url = `api/topics/get-topics`;

    return this.httpClient
      .post<any>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: any) => body));
  }

  getSingleTopic(topicIdOrSlug: any): Observable<any> {
    const url = `api/topics/get-topic/${topicIdOrSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  updateTopic(topicId: number, body: any): Observable<any> {
    const url = `api/topics/update-topic/${topicId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }
  deleteTopic(topicId: number): Observable<any> {
    const url = `api/topics/delete-topic/${topicId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }


  /**
   * Replies
   * */ 
  getReplies(body: any): Observable<any> {
    const url = `api/replies/get-replies`;

    return this.httpClient
      .post<any>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: any) => body));
  }

  getUserReplies(body: any): Observable<any> {
    const url = `api/replies/get-user-replies`;

    return this.httpClient
      .post<any>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: any) => body));
  }


  addReply(body: any): Observable<any> {
    const url = `api/replies/add-reply`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getSingleReply(replyIdOrSlug: any): Observable<any> {
    const url = `api/replies/get-reply/${replyIdOrSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  updateReply(replyId: number, body: any): Observable<any> {
    const url = `api/replies/update-reply/${replyId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }


  deleteReply(replyId: number): Observable<any> {
    const url = `api/replies/delete-reply/${replyId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  /**
   * Categories
   * */ 
  getCategories(): Observable<any> {
    const url = `api/forums/categories`;

    return this.httpClient.get<any>(url).pipe(map((body: any) => body));
  }

  addCategory(body: any): Observable<any> {
    const url = `api/forums/new-category`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateCategory(categoryId: number, body: any): Observable<any> {
    const url = `api/forums/update-category/${categoryId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteCategory(categoryId: number): Observable<any> {
    const url = `api/forums/delete-category/${categoryId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }



}
