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

  jobAlertPeriod = [
    { value: '1', viewValue: 'Daily' },
    { value: '7', viewValue: 'Weekly' },
    { value: '14', viewValue: 'Fortnightly' },
    { value: '30', viewValue: 'Monthly' },
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

  datePosted = [
    { value: '1hour', viewValue: 'Last Hour'},
    { value: '24hours', viewValue: 'Last 24 hours'},
    { value: '7days', viewValue: 'Last 7 days'},
    { value: '14days', viewValue: 'Last 14 days'},
    { value: '30days', viewValue: 'Last 30 days'},
    { value: 'all', viewValue: 'All'},
  ];

  constructor(private httpClient: HttpClient, private router: Router) {}

  getSectors(): Observable<Sector> {
    const url = 'api/jobs/sectors';

    return this.httpClient.get<Sector>(url, this.headerOptions);
  }

  addJobSector(body: any): Observable<any> {
    const url = 'api/jobs/new-job-sector';

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  editJobSector(jobSectorId: number, body: any): Observable<any> {
    const url = `api/jobs/update-job-sector/${jobSectorId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  deleteJobSector(jobSectorId: number): Observable<any> {
    const url = `api/jobs/delete-job-sector/${jobSectorId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  newJob(body: any): Observable<any> {
    const url = 'api/jobs/new-job';

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  editJob(jobId: number, body: any): Observable<any> {
    const url = `api/jobs/update-job/${jobId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  updateJobProperty(jobId: number, body: any): Observable<any> {
    const url = `api/jobs/update-job-property/${jobId}`;

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

  featureJob(id: number): Observable<Sector> {
    const url = `api/jobs/feature-job/${id}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getJobs(filter: any = {}, page: number = 1, limit: number = 10): Observable<Sector> {
    const url = `api/jobs/get-jobs?page=${page}&limit=${limit}`;

    return this.httpClient.post<any>(url, JSON.stringify(filter), this.headerOptions);
  }

  getJobCount(filter: any = {}): Observable<Sector> {
    const url = 'api/jobs/get-job-count';

    return this.httpClient.post<any>(url, JSON.stringify(filter), this.headerOptions);
  }

  newJobApplication(body: any): Observable<any> {
    const url = 'api/jobs/new-application';

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getJobApplications(jobId: number = null): Observable<any> {
    let url = 'api/jobs/get-applications';

    if (jobId) {
      url += `/${jobId}`;
    }

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getUserApplicationStatus(jobId: number): Observable<any> {
    const url = `api/jobs/get-application-status/${jobId}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  updateJobApplication(applicationId: number, body: any): Observable<any> {
    const url = `api/jobs/update-job-appliation/${applicationId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getAppliedJobs(): Observable<any> {
    const url = `api/jobs/get-applied-jobs`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  saveCandidate(candidateId: number): Observable<any> {
    const url = `api/jobs/save-candidate`;

    const body = {
      candidate_id: candidateId
    };

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getSavedCandidates(): Observable<any> {
    const url = `api/jobs/get-saved-candidates`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  deleteSavedCandidate(candidateId: number): Observable<any> {
    const url = `api/jobs/delete-saved-candidate/${candidateId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  saveFavoriteJob(jobId: number): Observable<any> {
    const url = `api/jobs/save-favorite-job`;

    const body = {
      jobId
    };

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getFavoriteJobs(): Observable<any> {
    const url = `api/jobs/get-favorite-jobs`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getJobPackages(): Observable<any> {
    const url = `api/jobs/get-job-packages`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  deleteFavoriteJob(jobId: number): Observable<any> {
    const url = `api/jobs/delete-favorite-job/${jobId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getCurrentPackage(): Observable<any> {
    const url = `api/jobs/get-current-package`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  sendMail(emailOptions: any): Observable<any> {
    const url = `api/mail/send`;

    return this.httpClient.post<any>(url, JSON.stringify(emailOptions), this.headerOptions);
  }

  createStripeCheckoutSession(body: any): Observable<any> {
    const url = `api/jobs/create-checkout-session`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  newJobAlert(body: any): Observable<any> {
    const url = 'api/jobs/create-job-alert';

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  unsubscribeJobAlert(body: any): Observable<any> {
    const url = 'api/jobs/unsubscribe-job-alert';

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

}
