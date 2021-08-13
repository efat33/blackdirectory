import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';

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

export type StockStatus = 'instock' | 'outstock' | 'backorder';

interface ProductBase {
  title: string;
  price: number;
  category_id: number;
  image: string;
  galleries: string[];
  description: string;
  stock_status: StockStatus;
  discounted_price: number | null;
  discount_start: Date | null;
  discount_end: Date | null;
  short_desc?: string;
  sku?: string;
  purchase_note?: string;
}

export interface Product extends ProductBase {
  id: number;
  user_id: number;
  category_name: string;
  is_downloadable: boolean;
  is_virtual: boolean;
  slug: string;
  status: 'publish';
  views: number;
  rating_average: number;
  rating_total: number;
  created_at: Date;
  updated_at: Date;
}

export interface PostNewProductBody extends ProductBase {
  tags: number[];
  is_downloadable: 1 | 0;
  is_virtual: 1 | 0;
  download_files?: {
    limit?: number;
    expire_days?: number;
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
  params?: {
    keyword?: string;
    category?: number;
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

  constructor(private http: HttpClient, private helperService: HelperService) {}

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

  getTotalNumberOfProducts(): Observable<number> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/products`, {}).pipe(
      pluck('data'),
      map((products) => products.length)
    );
  }

  getProductList(params: GetProductListBody): Observable<Product[]> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/products`, params).pipe(
      map((response) =>
        response.data.map((p) => ({
          ...p,
          image: this.helperService.getImageUrl(p.image, 'product', 'medium'),
          galleries: JSON.parse(p.galleries).map((gallery) => this.helperService.getImageUrl(gallery, 'product')),
          is_downloadable: Boolean(p.is_downloadable),
          is_virtual: Boolean(p.is_virtual),
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
          rating_average: parseFloat(p.rating_average),
        }))
      )
    );
  }

  getProductReview(id: number): Observable<ProductReview[]> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/details/${id}`).pipe(pluck('data'));
  }

  postNewProductReview(id: number, review: ProductReview): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/product/${id}/review`, review);
  }
}