import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DealsService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getDeals(filter: any = {}, page: number = null, limit: number = null, count: boolean = false): Observable<any> {
    const searchParams = new URLSearchParams();

    if (page) {
      searchParams.append('page', page.toString());

      if (limit) {
        searchParams.append('limit', limit.toString());
      }
    }

    let url = `api/deals/get-deals`;
    if (count) {
      url = `api/deals/get-deal-count`;
    }

    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }

    return this.httpClient.post<any>(url, JSON.stringify(filter), this.headerOptions);
  }

  getDeal(idOrSlug: any): Observable<any> {
    const url = `api/deals/get-deal/${idOrSlug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addDeal(body: any): Observable<any> {
    const url = `api/deals/add-deal`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateDeal(dealId: number, body: any): Observable<any> {
    const url = `api/deals/update-deal/${dealId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteDeal(dealId: number): Observable<any> {
    const url = `api/deals/delete-deal/${dealId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getDealers(): Observable<any> {
    const url = `api/deals/get-dealers`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addDealer(body: any): Observable<any> {
    const url = `api/deals/add-dealer`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateDealer(dealerId: number, body: any): Observable<any> {
    const url = `api/deals/update-dealer/${dealerId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteDealer(dealerId: number): Observable<any> {
    const url = `api/deals/delete-dealer/${dealerId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }
}
