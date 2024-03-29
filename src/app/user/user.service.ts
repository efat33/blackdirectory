import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAPIReponse } from './user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { InterceptorService } from '../interceptor.service';
import { APIReponse } from '../shared/apiResponse';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from '../shared/helper.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  clientIp: ReplaySubject<string> = new ReplaySubject(1);

  sectors = [
    { id: 1, value: 'steak-0' },
    { id: 2, value: 'pizza-1' },
    { id: 3, value: 'tacos-2' },
  ];

  publicViews = [
    { value: 1, viewValue: 'Yes' },
    { value: 0, viewValue: 'No' },
  ];

  jobIndustrys = [
    { value: 'Arts & Media', viewValue: 'Arts & Media' },
    { value: 'Education', viewValue: 'Education' },
    { value: 'Accounting/ Finance/ Legal', viewValue: 'Accounting/ Finance/ Legal' },
    { value: 'Medical/Healthcare', viewValue: 'Medical/Healthcare' },
    { value: 'Business Services', viewValue: 'Business Services' },
    { value: 'Retail/Sales', viewValue: 'Retail/Sales' },
    { value: 'Information Technology', viewValue: 'Information Technology' },
    { value: 'Other', viewValue: 'Other' },
  ];

  salaryTypes = [
    { value: 'Monthly', viewValue: 'Monthly' },
    { value: 'Weekly', viewValue: 'Weekly' },
    { value: 'Hourly', viewValue: 'Hourly' },
    { value: 'Annually', viewValue: 'Annually' },
  ];

  candidateAges = [
    { value: '16 - 18 Years', viewValue: '16 - 18 Years' },
    { value: '19 - 22 Years', viewValue: '19 - 22 Years' },
    { value: '23 - 27 Years', viewValue: '23 - 27 Years' },
    { value: '28 - 35 Years', viewValue: '28 - 35 Years' },
    { value: '36 - 45 Years', viewValue: '36 - 45 Years' },
    { value: '46 - 55 Years', viewValue: '46 - 55 Years' },
    { value: '56 - 65 Years', viewValue: '56 - 65 Years' },
    { value: 'Above 65 Years', viewValue: 'Above 65 Years' },
  ];

  candidateGenders = [
    { value: 'Male', viewValue: 'Male' },
    { value: 'Female', viewValue: 'Female' },
    { value: 'Transgender', viewValue: 'Transgender' },
    { value: 'Non-Binary', viewValue: 'Non-Binary' },
    { value: 'Prefer Not To Say', viewValue: 'Prefer Not To Say' },
  ];

  academics = [
    { value: "GCSE's/ Equivalent", viewValue: "GCSE's/ Equivalent" },
    { value: 'A-Levels', viewValue: 'A-Levels' },
    { value: 'Apprenticeship', viewValue: 'Apprenticeship' },
    { value: 'Undergraduate Degree', viewValue: 'Undergraduate Degree' },
    { value: 'Master’s Degree', viewValue: 'Master’s Degree' },
    { value: 'Doctorate', viewValue: 'Doctorate' },
    { value: 'Other', viewValue: 'Other' },
  ];

  forumRoles = [
    {
      value: 'keymaster',
      viewValue: 'Keymaster',
    },
    {
      value: 'moderator',
      viewValue: 'Moderator',
    },
    {
      value: 'participant',
      viewValue: 'Participant',
    },
    {
      value: 'spectator',
      viewValue: 'Spectator',
    },
    {
      value: 'blocked',
      viewValue: 'Blocked',
    },
  ];

  onRegisterLinkModal: EventEmitter<any> = new EventEmitter();
  onForgotPassLinkModal: EventEmitter<any> = new EventEmitter();
  onLoginLinkModal: EventEmitter<any> = new EventEmitter();
  onResetPassLinkModal: EventEmitter<any> = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private interceptorService: InterceptorService,
    private helperService: HelperService
  ) {
    this.getClientIP();

    this.interceptorService.logout.subscribe(() => {
      this.logout();
    });
  }

  getClientIP() {
    this.httpClient.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.clientIp.next(res.ip);
    });
  }

  addUser(body: any): Observable<UserAPIReponse> {
    const url = 'api/users/register';

    return this.httpClient
      .post<UserAPIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: UserAPIReponse) => body));
  }

  loginUser(body: any): Observable<UserAPIReponse> {
    const url = 'api/users/login';

    return this.httpClient
      .post<UserAPIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: UserAPIReponse) => body));
  }

  getProfile(id: number = null): Observable<UserAPIReponse> {
    let url = 'api/users/user-profile';

    if (id) {
      url += `/${id}`;
    }

    return this.httpClient.get<UserAPIReponse>(url, this.headerOptions);
  }

  getDetails(username: string): Observable<UserAPIReponse> {
    const url = `api/users/user-details/${username}`;

    return this.httpClient.get<UserAPIReponse>(url, this.headerOptions);
  }

  getDetailsByID(id: string): Observable<UserAPIReponse> {
    const url = `api/users/user-details-by-id/${id}`;

    return this.httpClient.get<UserAPIReponse>(url, this.headerOptions);
  }

  logout(): void {
    const url = 'api/users/logout';

    this.httpClient.get<UserAPIReponse>(url, this.headerOptions).subscribe(
      () => {
        // remove user data from localstorage
        localStorage.removeItem('currentUserInfo');

        this.auth
          .signOut()
          .then(() => {
            // redirect user to home page and refresh the page
            this.router.navigate(['home']).then(() => {
              window.location.reload();
            });
          })
          .catch(() => {
            // redirect user to home page and refresh the page
            this.router.navigate(['home']).then(() => {
              window.location.reload();
            });
          });

        // redirect user to home page and refresh the page
        this.router.navigate(['home']).then(() => {
          window.location.reload();
        });
      },
      () => {}
    );
  }

  checkAuthentication(): void {
    const url = 'api/users/authenticated';

    this.httpClient.get<UserAPIReponse>(url, this.headerOptions).subscribe(
      () => {
        // if authenticated, pass the user forward
      },
      () => {
        // if not authentication, logout and redirect to home
        this.logout();
      }
    );
  }

  isAuthenticated(): Promise<any> {
    const url = 'api/users/authenticated';

    return this.httpClient.get<UserAPIReponse>(url, this.headerOptions).toPromise();
  }

  update(body: any, id: number = null): Observable<UserAPIReponse> {
    let url = 'api/users/user-update';

    if (id) {
      url += `/${id}`;
    }

    return this.httpClient
      .post<UserAPIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: UserAPIReponse) => body));
  }

  getReviews(id: number): Observable<any> {
    const url = `api/users/user-review/${id}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  newReview(id: number, body: any): Observable<any> {
    const url = `api/users/user-review/${id}`;

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getFollowingEmployers(): Observable<any> {
    const url = `api/users/get-followings`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getFollowers(): Observable<any> {
    const url = `api/users/get-followers`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  followEmployer(employerId: number): Observable<any> {
    const url = `api/users/follow/${employerId}`;

    return this.httpClient.post<any>(url, JSON.stringify({}), this.headerOptions);
  }

  unfollowEmployer(employerId: number): Observable<any> {
    const url = `api/users/unfollow/${employerId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getNotifications(): Observable<any> {
    const url = `api/users/get-notifications`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  updateNotification(notificationId: number, body: any): Observable<any> {
    const url = `api/users/update-notification/${notificationId}`;

    return this.httpClient.put<any>(url, JSON.stringify(body), this.headerOptions);
  }

  removeNotification(notificationId: number): Observable<any> {
    const url = `api/users/notification/${notificationId}`;

    return this.httpClient.delete<any>(url, this.headerOptions);
  }

  getUsers(userIds: number[]): Observable<any> {
    const url = `api/users/get-users`;

    const body = {
      userIds,
    };

    return this.httpClient.post<any>(url, JSON.stringify(body), this.headerOptions);
  }

  getAllUsers(): Observable<any> {
    const url = `api/users/get-all-users`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getDeactivatedUsers(): Observable<any> {
    const url = `api/users/get-deactivated-users`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  forgotPassword(body: any): Observable<APIReponse> {
    const url = 'api/users/forgot-password';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  resetPassword(body: any): Observable<APIReponse> {
    const url = 'api/users/reset-password';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  changePassword(body: any): Observable<APIReponse> {
    const url = 'api/users/change-password';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  verifyEmail(verificationKey: string): Observable<any> {
    const url = `api/users/verify-email/${verificationKey}`;

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  getCandidateCV(applicationId: any) {
    const url = `api/users/get-candidate-cv/${applicationId}`;

    const httpOptions = {
      responseType: 'blob' as any,
    };

    return this.httpClient.get<any>(url, httpOptions);
  }

  resendVerificationMail(): Observable<APIReponse> {
    const url = 'api/users/resend-email';

    return this.httpClient.get<APIReponse>(url, this.headerOptions).pipe(map((body: APIReponse) => body));
  }

  userRequest(body: any): Observable<APIReponse> {
    const url = 'api/users/user-request';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  getUserRequest(): Observable<APIReponse> {
    const url = 'api/users/user-request';

    return this.httpClient.get<any>(url, this.headerOptions);
  }

  userRequestDeactivate(body: any): Observable<APIReponse> {
    const url = 'api/users/user-request-deactivate';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }

  userRequestReactivate(body: any): Observable<APIReponse> {
    const url = 'api/users/user-request-reactivate';

    return this.httpClient
      .post<APIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: APIReponse) => body));
  }
}
