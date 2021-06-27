import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Sector } from "./jobs";

@Injectable({
  providedIn: 'root',
})

export class JobService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  

  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) {}


  getSectors(): Observable<Sector> {
    const url = 'api/jobs/sectors';

    return this.httpClient
      .get<Sector>(url, this.headerOptions);
  }



  
}
