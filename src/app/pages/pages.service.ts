import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  readonly unlimitedNumber: number = 99999;

  categories = [
    {
      title: 'Contract Phones',
      value: 'contract-phones',
    },
    {
      title: 'Sim Only',
      value: 'sim-only',
    },
    {
      title: 'Upgrades',
      value: 'upgrades',
    },
  ];

  constructor(private httpClient: HttpClient) {}

  getPages(params: any = {}): Observable<any> {
    const url = `api/pages/get-pages`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getPage(pageSlug: string): Observable<any> {
    const url = `api/pages/get-page/${pageSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addPage(body: any): Observable<any> {
    const url = `api/pages/add-page`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updatePage(pageSlug: string, body: any): Observable<any> {
    const url = `api/pages/update-page/${pageSlug}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deletePage(pageSlug: string): Observable<any> {
    const url = `api/pages/delete-page/${pageSlug}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getFaqs(params: any = {}): Observable<any> {
    const url = `api/pages/get-faqs`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getFaq(faqId: string): Observable<any> {
    const url = `api/pages/get-faq/${faqId}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addFaq(body: any): Observable<any> {
    const url = `api/pages/add-faq`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateFaq(faqId: string, body: any): Observable<any> {
    const url = `api/pages/update-faq/${faqId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteFaq(faqId: string): Observable<any> {
    const url = `api/pages/delete-faq/${faqId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }
}
