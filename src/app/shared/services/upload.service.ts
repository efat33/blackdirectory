import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { APIReponse } from "../apiResponse";

@Injectable({
  providedIn: 'root',
})

export class UploadService {
  headerOptions = {
    headers: new HttpHeaders({
     'Content-Type': 'multipart/form-data',
    }),
  };


  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {}


  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  
  
  uploadImage(body: any, path): Observable<any> {
    const url = `api/upload/image-${path}`;

    return this.httpClient
      .post(url, body, {
        reportProgress: true,
        observe: 'events'
      });

  }

  uploadFile(body: any, path): Observable<any> {
    const url = `api/upload/file-${path}`;

    return this.httpClient
      .post(url, body, {
        reportProgress: true,
        observe: 'events'
      });

  }

  


  
}
