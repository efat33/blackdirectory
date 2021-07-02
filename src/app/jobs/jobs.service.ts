import { Injectable, Inject, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { Sector } from "./jobs";

@Injectable({
  providedIn: "root",
})
export class JobService {
  headerOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private httpClient: HttpClient, private router: Router) {}

  getSectors(): Observable<Sector> {
    const url = "api/jobs/sectors";

    return this.httpClient.get<Sector>(url, this.headerOptions);
  }

  newJob(body: any): Observable<any> {
    const url = "api/jobs/new-job";

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getUserJobs(): Observable<Sector> {
    const url = "api/jobs/get-user-jobs";

    return this.httpClient.get<any>(url, this.headerOptions);
  }
}
