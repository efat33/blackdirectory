import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, mergeMapTo, pluck } from 'rxjs/operators';
import { ApiResponse } from './product.service';

export type PaymentMethods = 'card';
export type PaymentRequestStatus = 'Pending' | string;

export interface NewWithdrawRequestParams {
  amount: number;
  payment_method: PaymentMethods;
}

export interface WithdrawRequestData {
  id: number;
  user_id: number;
  amount: number;
  payment_method: PaymentMethods;
  status: PaymentRequestStatus;
  date: Date;
}

export interface WithdrawData {
  current_balance: number;
  total_earned: number;
  withdraw_requests: WithdrawRequestData[];
}

@Injectable({
  providedIn: 'root',
})
export class WithdrawService {
  BASE_URL = 'api/shop/withdraw-request';
  paymentMethods: { value: PaymentMethods; label: string }[] = [{ value: 'card', label: 'Card' }];

  constructor(private http: HttpClient) {}

  getData(): Observable<WithdrawData> {
    return this.http.get<ApiResponse<WithdrawData>>(`${this.BASE_URL}s`).pipe(pluck('data'));
  }

  postNewWithdrawRequest(params: NewWithdrawRequestParams): Observable<{ success: boolean; data: WithdrawData }> {
    return this.http.post<ApiResponse<undefined>>(this.BASE_URL, params).pipe(
      mapTo(true),
      catchError((err) => of(false)),
      mergeMap((success) => {
        return forkJoin({
          success: of(success),
          data: this.getData(),
        });
      })
    );
  }
}
