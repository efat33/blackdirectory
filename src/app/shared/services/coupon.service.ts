import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, pluck, shareReplay, tap } from 'rxjs/operators';
import { ApiResponse } from './product.service';

export interface Coupon {
  code: string;
  id: number;
  discount: number;
}

const EMPTY_COUPON = {
  code: '',
  discount: 0,
  id: null,
};

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private COUPON_LOCAL_STORAGE_KEY = 'blackdirectory_coupon';
  private appliedCoupon$ = new BehaviorSubject<Coupon>(EMPTY_COUPON);

  constructor(private http: HttpClient) {
    this.initCoupon();

    this.appliedCoupon.subscribe((coupon) => {
      sessionStorage.setItem(this.COUPON_LOCAL_STORAGE_KEY, JSON.stringify(coupon));
    });
  }

  get appliedCoupon(): Observable<Coupon> {
    return this.appliedCoupon$.asObservable().pipe(shareReplay(1));
  }

  private getPromoCode(code: string): Observable<Coupon> {
    return this.http.get<ApiResponse<any>>(`api/shop/promo-code/${code}`).pipe(
      pluck('data'),
      map((data) => data[0]),
      catchError((_) => {
        return of({
          code: '',
          discount: 0,
          id: null,
        });
      })
    );
  }

  private initCoupon(): void {
    const localCoupon = sessionStorage.getItem(this.COUPON_LOCAL_STORAGE_KEY);
    const coupon = localCoupon
      ? JSON.parse(localCoupon)
      : {
          code: '',
          discount: 0,
          id: null,
        };
    this.appliedCoupon$.next(coupon);
  }

  calculateDiscountAmount(subtotal: number): number {
    return subtotal * (this.appliedCoupon$.value.discount / 100);
  }

  applyCoupon(code: string): Observable<boolean> {
    if (code) {
      return this.getPromoCode(code).pipe(
        tap((coupon) => this.appliedCoupon$.next(coupon)),
        map((coupon) => coupon.discount > 0)
      );
    } else {
      this.appliedCoupon$.next(EMPTY_COUPON);
      return of(false);
    }
  }
}
