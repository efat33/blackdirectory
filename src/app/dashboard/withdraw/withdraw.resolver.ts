import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WithdrawService } from 'src/app/shared/services/withdraw.service';

@Injectable({ providedIn: 'root' })
export class WithdrawResolver implements Resolve<any> {
  constructor(private withdrawService: WithdrawService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.withdrawService.getData();
  }
}
