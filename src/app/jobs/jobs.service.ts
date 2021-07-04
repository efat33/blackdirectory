import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Sector } from './jobs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  jobIndustrys = [
    { value: 'Arts & Media', viewValue: 'Arts & Media' },
    { value: 'Education', viewValue: 'Education' },
    {
      value: 'Accounting/ Finance/ Legal',
      viewValue: 'Accounting/ Finance/ Legal',
    },
    { value: 'Medical/Healthcare', viewValue: 'Medical/Healthcare' },
    { value: 'Business Services', viewValue: 'Business Services' },
    { value: 'Retail/Sales', viewValue: 'Retail/Sales' },
    { value: 'Information Technology', viewValue: 'Information Technology' },
    { value: 'Other', viewValue: 'Other' },
  ];

  jobTypes = [
    { value: 'contract', viewValue: 'Contract' },
    { value: 'full-time', viewValue: 'Full Time' },
    { value: 'internship', viewValue: 'Internship' },
    { value: 'part-time', viewValue: 'Part Time' },
    { value: 'temporary', viewValue: 'Temporary' },
  ];

  jobApplyTypes = [
    { value: 'internal', viewValue: 'Internal (Receive Applications Here)' },
    { value: 'external', viewValue: 'External URL' },
    { value: 'with_email', viewValue: 'By Email' },
  ];

  jobExperiences = [
    { value: 'no-experience', viewValue: 'No Experience' },
    { value: 'less-than-1-year', viewValue: 'Less Than 1 Year' },
    { value: '2-years', viewValue: '2 Years' },
    { value: '3-years', viewValue: '3 Years' },
    { value: '4-years', viewValue: '4 Years' },
    { value: '5-years', viewValue: '5 Years' },
    { value: '6-years', viewValue: '6 Years' },
    { value: '7-years', viewValue: '7 Years' },
    { value: '8-years-+', viewValue: '8 Years +' },
  ];

  constructor(private httpClient: HttpClient, private router: Router) {}

  getSectors(): Observable<Sector> {
    const url = 'api/jobs/sectors';

    return this.httpClient.get<Sector>(url, this.headerOptions);
  }

  newJob(body: any): Observable<any> {
    const url = 'api/jobs/new-job';

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  editJob(jobId: number, body: any): Observable<any> {
    const url = `api/jobs/update-job/${jobId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteJob(jobId: number): Observable<any> {
    const url = `api/jobs/delete-job/${jobId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getUserJobs(): Observable<Sector> {
    const url = 'api/jobs/get-user-jobs';

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getUserJob(jobId: number): Observable<Sector> {
    const url = `api/jobs/get-user-job/${jobId}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getJob(slug: string): Observable<Sector> {
    const url = `api/jobs/get-job/${slug}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }
}
