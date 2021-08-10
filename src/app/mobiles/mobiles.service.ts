import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MobilesService {
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

  getMobiles(params: any = {}): Observable<any> {
    const urlParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        urlParams.append(key, value.join(','));
      } else {
        urlParams.append(key, value.toString());
      }
    }

    let url = `api/mobiles/get-mobiles`;

    if (urlParams.toString()) {
      url += `?${urlParams.toString()}`;
    }

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getMobile(mobileId: any): Observable<any> {
    const url = `api/mobiles/get-mobile/${mobileId}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addMobile(body: any): Observable<any> {
    const url = `api/mobiles/add-mobile`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateMobile(mobileId: number, body: any): Observable<any> {
    const url = `api/mobiles/update-mobile/${mobileId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteMobile(mobileId: number): Observable<any> {
    const url = `api/mobiles/delete-mobile/${mobileId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getTopMobiles(): Observable<any> {
    const url = `api/mobiles/get-top-mobiles`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getMobileProviders(): Observable<any> {
    const url = `api/mobiles/get-providers`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  addMobileProvider(body: any): Observable<any> {
    const url = `api/mobiles/add-provider`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateMobileProvider(providerId: number, body: any): Observable<any> {
    const url = `api/mobiles/update-provider/${providerId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteMobileProvider(providerId: number): Observable<any> {
    const url = `api/mobiles/delete-provider/${providerId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }
}
