import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/shared/helper.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Injectable({ providedIn: 'root' })
export class StoreResolver implements Resolve<any> {
  constructor(private storeService: StoreService, private helperService: HelperService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.storeService.getStoreSettings(this.helperService.currentUserInfo.id);
  }
}
