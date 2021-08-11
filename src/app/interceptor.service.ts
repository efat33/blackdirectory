import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  /*
   ****** IMPORTANT *********
   ****** DO NOT INJECT 'HttpClient' *******
   ****** THIS WILL CAUSE 'Maximum call stack size exceeded' ERROR ****
   */

  logout = new Subject<any>();

  constructor() {}
}
