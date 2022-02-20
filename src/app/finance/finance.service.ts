import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getFinance(): Observable<any> {
    const url = `api/finance/get-finance`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getFinanceByQuery(filter: any = {}): Observable<any> {
    const url = `api/finance/get-finance`;

    return this.httpClient.post<any>(url, JSON.stringify(filter), this.headerOptions);
  }

  getSingleFinance(financeIdOrSlug: any): Observable<any> {
    const url = `api/finance/get-finance/${financeIdOrSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addFinance(body: any): Observable<any> {
    const url = `api/finance/add-finance`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateFinance(financeId: number, body: any): Observable<any> {
    const url = `api/finance/update-finance/${financeId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteFinance(financeId: number): Observable<any> {
    const url = `api/finance/delete-finance/${financeId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }


}
