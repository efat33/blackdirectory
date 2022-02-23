import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMapTo, pluck } from 'rxjs/operators';
import { ApiResponse } from './product.service';

export interface ShippingOption {
  fee: number;
  id: number;
  zones: any;
  shipping_order: number;
  title: string;
  vendor_id: number;
}

export interface PostShippingMethodBody {
  title: string;
  zones: any;
  fee: number;
  shipping_order: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  BASE_URL = 'api/shop/shipping';

  constructor(private http: HttpClient) {}

  getShippingMethods(userId?: number): Observable<ShippingOption[]> {
    const queryParam = userId ? '?user_id=' + userId : '';
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}s${queryParam}`).pipe(
      pluck('data'),
      map((data) =>
        data.map((opt) => ({
          ...opt,
          zones: opt.zones ? JSON.parse(opt.zones) : [],
          fee: parseFloat(opt.fee),
        }))
      ),
      map((data) => data.sort((a, b) => a.shipping_order - b.shipping_order))
    );
  }

  postShippingMethod(body: PostShippingMethodBody): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(`${this.BASE_URL}`, body)
      .pipe(pluck('data'), mergeMapTo(this.getShippingMethods()));
  }

  putShippingMethod(id: number, body: PostShippingMethodBody): Observable<any> {
    return this.http
      .put<ApiResponse<any>>(`${this.BASE_URL}/${id}`, body)
      .pipe(pluck('data'), mergeMapTo(this.getShippingMethods()));
  }

  delShippingMethod(id: number): Observable<any> {
    return this.http
      .delete<ApiResponse<any>>(`${this.BASE_URL}/${id}`)
      .pipe(pluck('data'), mergeMapTo(this.getShippingMethods()));
  }
}
