import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Category {
  id: number;
  title: string;
  image: string;
}

export interface Tag {
  id: number;
  title: string;
}

export interface PostNewProductBody {
  title: string;
  price: number;
  category_id: number;
  image: string;
  short_desc: string;
  description: string;
  stock_status: 'instock' | 'outstock' | 'backorder';
  tags: number[];
  galleries: string[];
  is_downloadable: 1 | 0;
  is_virtual: 1 | 0;
  discounted_price?: number;
  discount_start?: Date;
  discount_end?: Date;
  sku?: string;
  purchase_note?: string;
  download_files?: {
    limit: number;
    expire_days: number;
    files: {
      name: string;
      file: string;
    }[];
  };
}

export interface PostEditProductBody extends PostNewProductBody {
  id: number;
}

export interface GetProductListBody {
  limit: number;
  offset: number;
  orderby: string;
  order: 'DESC' | 'ASC';
  params: {
    keyword: string;
    category: number;
  };
}

export interface ProductReview {
  rating: number;
  review: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private BASE_URL = 'api/shop';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.BASE_URL}/product-categories`).pipe(pluck('data'));
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<ApiResponse<Tag[]>>(`${this.BASE_URL}/product-tags`).pipe(pluck('data'));
  }

  postNewProduct(form: PostNewProductBody): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/product/new`, form);
  }

  postEditProduct(form: PostEditProductBody): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/product/edit`, form);
  }

  getProductDetails(slug: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/product/${slug}`);
  }

  getProductList(params: GetProductListBody): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/products`, params);
  }

  getProductReview(id: number): Observable<ProductReview[]> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/details/3`).pipe(pluck('data'));
  }

  postNewProductReview(review: ProductReview): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/product/2/review`, review);
  }
}
