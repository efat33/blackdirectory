import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UserAPIReponse } from "./user";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  clickedRegisterLinkModal:  EventEmitter<any> = new EventEmitter();
  clickedLoginLinkModal:  EventEmitter<any> = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) {}


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

  getProfile(): Observable<UserAPIReponse> {
    const url = 'api/users/user-profile';

    return this.httpClient
      .get<UserAPIReponse>(url, this.headerOptions);
  }

  getDetails(): Observable<UserAPIReponse> {
    const url = 'api/users/user-details';

    return this.httpClient
      .get<UserAPIReponse>(url, this.headerOptions);
  }

  logout(): void {
    const url = 'api/users/logout';

    this.httpClient
      .get<UserAPIReponse>(url, this.headerOptions).subscribe(
        () => {
          // remove user data from localstorage
          localStorage.removeItem('currentUserInfo');

          // redirect user to home page and refresh the page
          this.router.navigate(['home'])
          .then( () => {
            window.location.reload();
          });

        },
        () => {

        }
      );

  }

  checkAuthentication(): void {
    const url = 'api/users/authenticated';

    this.httpClient
      .get<UserAPIReponse>(url, this.headerOptions).subscribe(
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

    return this.httpClient
      .get<UserAPIReponse>(url, this.headerOptions).toPromise(
        
      );


  }

  update(body: any): Observable<UserAPIReponse> {
    const url = 'api/users/user-update';

    return this.httpClient
      .post<UserAPIReponse>(url, JSON.stringify(body), this.headerOptions)
      .pipe(map((body: UserAPIReponse) => body));

  }

  
}
