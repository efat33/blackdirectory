import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { HelperService } from '../helper.service';
import { ApiResponse } from './product.service';

export interface Country {
  area_code: string;
  code: string;
  id: number;
  nationality: string;
  title: string;
}

export interface PostStoreSettingsBody {
  store_name: string;
  product_per_page: number;
  phone?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  show_email: boolean;
  show_more_products: boolean;
  profile_picture: string;
  banner?: string;
}

interface GetStoreSettingsData {
  user_id: number;
  phone: null | string;
  address: null | string;
  latitude: null | string;
  longitude: null | string;
  profile_picture: string;
  banner: null | string;
  product_per_page: number;
  show_email: 1 | 0;
  show_more_products: 1 | 0;
  store_name: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient, private helperService: HelperService) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<ApiResponse<Country[]>>('api/shop/countries').pipe(pluck('data'));
  }

  getStoreSettings(userId: number) {
    return this.http.get<ApiResponse<GetStoreSettingsData[]>>(`api/shop/details/${userId}`).pipe(
      pluck('data'),
      map((data) => data[0]),
      map((data) => ({
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        show_email: Boolean(data.show_email),
        show_more_products: Boolean(data.show_more_products),
      }))
    );
  }

  postStoreSettings(params: PostStoreSettingsBody): Observable<any> {
    return this.http.post<ApiResponse<any>>(`api/shop/details`, params);
  }
}