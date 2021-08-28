// AuthGuard Service
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
  CanLoad,
  Route,
  UrlSegment,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { HelperService } from '../helper.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private helperService: HelperService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.helperService.currentUserInfo) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.helperService.currentUserInfo) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthVerifiedGuard implements CanActivate, CanActivateChild {
  constructor(private helperService: HelperService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.helperService.currentUserInfo?.verified != 1) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.helperService.currentUserInfo?.verified != 1) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}


@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private helperService: HelperService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.helperService.isAdmin()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.helperService.isAdmin()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.helperService.isAdmin()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class EmployerGuard implements CanActivate, CanActivateChild {
  constructor(private helperService: HelperService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.helperService.isAdminOrEmployer()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.helperService.isAdminOrEmployer()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
