import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { ApiResponse } from './product.service';

export type OrderStatus =
  | 'Pending payment'
  | 'Processing'
  | 'On hold'
  | 'Completed'
  | 'Cancelled'
  | 'Refunded'
  | 'Failed';
export interface ShippingDetails {
  first_name: string;
  last_name: string;
  company_name?: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
}

export interface OrderDetailsItem {
  created_at: Date;
  id: number;
  order_id: number;
  price: number;
  product_id: number;
  product_image: string;
  product_price: number;
  product_slug: string;
  product_title: string;
  quantity: number;
}

export interface PostNewOrderParams {
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  shipping: ShippingDetails & { country_id: number };
  shipping_methods: { vendor_id: number; shipping_id: number }[];
  promo_id?: number;
  additional_info?: string;
}

export interface OrderList {
  id: number;
  user_id: number;
  subtotal: number;
  total: number;
  earned: number;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  parent_id: number;
  vendor_id?: number;
  additional_info?: string;
  discount?: number;
  promo_code?: string;
  promo_id_: number;
  shipping_fee?: number;
  shipping_id?: number;
  shipping_title?: string;
}

export interface OrderDetails extends OrderList {
  items: OrderDetailsItem[];
  shipment: ShippingDetails & { country: string };
  subOrders: OrderList[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  BASE_URL = 'api/shop';

  headerOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  private _mapOrderList(list: any[]): OrderList[] {
    return list.map((d) => ({
      ...d,
      subtotal: Number(d.subtotal),
      total: Number(d.total),
      earned: Number(d.earned),
      discount: Number(d.discount),
      shipping_fee: Number(d.shipping_fee),
      updated_at: new Date(d.updated_at),
      created_at: new Date(d.created_at),
    }));
  }

  private _mapOrderDetails(d: any): OrderDetails {
    return {
      ...this._mapOrderList([d])[0],
      shipment: d.shipment[0],
      items: d.items.map((item) => ({
        ...item,
        created_at: new Date(item.created_at),
        price: Number(item.price),
        shipping_fee: Number(d.shipping_fee),
      })),
      subOrders: this._mapOrderList(d.subOrders || []),
    };
  }

  getOrderDetails(orderId: number): Observable<OrderDetails> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/order/${orderId}`).pipe(
      pluck('data'),
      map((data) => data[0]),
      map((d) => this._mapOrderDetails(d))
    );
  }

  getOrders(): Observable<OrderList[]> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/orders`).pipe(
      pluck('data'),
      map((list) => this._mapOrderList(list))
    );
  }

  getVendorOrders(): Observable<OrderList[]> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/vendor-orders`).pipe(
      pluck('data'),
      map((list) => this._mapOrderList(list))
    );
  }

  postNewOrder(params: PostNewOrderParams): Observable<number> {
    return this.http
      .post<ApiResponse<{ order_id: number }>>(`${this.BASE_URL}/order`, params)
      .pipe(pluck('data', 'data', 'order_id'));
  }

  putOrderStatus({ orderId, status }: { orderId: number; status: string }): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.BASE_URL}/order/${orderId}/status`, { status }).pipe(pluck('data'));
  }

  createStripeCheckoutSession(body: any): Observable<any> {
    const url = `${this.BASE_URL}/create-checkout-session`;

    return this.http.post<any>(url, JSON.stringify(body), this.headerOptions);
  }
}
