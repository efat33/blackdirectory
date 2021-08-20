import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { ApiResponse } from './product.service';

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
  subtotal: number;
  total: number;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  shipping: ShippingDetails & { country_id: number };
  promo_id?: number;
  additional_info?: string;
}

export interface OrderList {
  id: number;
  user_id: number;
  subtotal: number;
  total: number;
  earned: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  additional_info?: string;
  discount?: number;
  promo_code?: string;
}

export interface OrderDetails extends OrderList {
  items: OrderDetailsItem[];
  shipment: ShippingDetails & { country: string };
  promo_id?: number;
  discount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  BASE_URL = 'api/shop/order';
  constructor(private http: HttpClient) {}

  getOrderDetails(orderId: number): Observable<OrderDetails> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/${orderId}`).pipe(
      pluck('data'),
      map((data) => data[0]),
      map((d) => ({
        ...d,
        shipment: d.shipment[0],
        subtotal: Number(d.subtotal),
        total: Number(d.total),
        earned: Number(d.earned),
        discount: Number(d.discount),
        updated_at: new Date(d.updated_at),
        created_at: new Date(d.created_at),
        items: d.items.map((item) => ({
          ...item,
          created_at: new Date(item.created_at),
          price: Number(item.price),
        })),
      }))
    );
  }

  gerOrders(): Observable<OrderList[]> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}s`).pipe(
      pluck('data'),
      map((list) =>
        list.map((d) => ({
          ...d,
          subtotal: Number(d.subtotal),
          total: Number(d.total),
          earned: Number(d.earned),
          updated_at: new Date(d.updated_at),
          created_at: new Date(d.created_at),
        }))
      )
    );
  }

  postNewOrder(params: PostNewOrderParams): Observable<number> {
    return this.http
      .post<ApiResponse<{ order_id: number }>>(this.BASE_URL, params)
      .pipe(pluck('data', 'data', 'order_id'));
  }
}
