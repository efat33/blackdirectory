import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck, switchMap, switchMapTo } from 'rxjs/operators';
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
export type ProductStatus = 'publish';

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
  is_downloadable: boolean | (1 | 0);
  is_virtual: boolean | (1 | 0);
  short_desc?: string;
  sku?: string;
  purchase_note?: string;
}
interface PopulatedProduct extends ProductBase {
  id: number;
  user_id: number;
  slug: string;
  status: ProductStatus;
  views: number;
  rating_total: number;
  is_downloadable: boolean;
  is_virtual: boolean;
  rating_average: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductList extends PopulatedProduct {
  category_name: string;
}

export interface ProductDetails extends PopulatedProduct {
  tags: Tag[];
  category_name: string;
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
    tag?: number;
    user_id?: number;
  };
}

export interface ProductReviewParams {
  product_id: number;
  rating: number;
  review: string;
}

export interface ProductReview {
  created_at: Date;
  id: number;
  product_id: number;
  rating: number;
  review: string;
  user_display_name: string;
  user_id: number;
  user_profile_photo: string;
  user_username: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private BASE_URL = 'api/shop';

  constructor(private http: HttpClient, private helperService: HelperService) {}

  hasDiscount(product: ProductDetails | ProductList): boolean {
    const { discount_end, discount_start, discounted_price } = product;
    return (
      discount_end &&
      discount_end.getTime() > Date.now() &&
      discount_start &&
      discount_start.getTime() < Date.now() &&
      discounted_price != null
    );
  }

  getActualPrice(product: ProductDetails | ProductList): number {
    if (this.hasDiscount(product)) {
      return product.discounted_price;
    } else {
      return product.price;
    }
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.BASE_URL}/product-categories`).pipe(pluck('data'));
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<ApiResponse<Tag[]>>(`${this.BASE_URL}/product-tags`).pipe(pluck('data'));
  }

  postNewProduct(form: PostNewProductBody) {
    return this.http.post<ApiResponse<undefined>>(`${this.BASE_URL}/product/new`, form);
  }

  postEditProduct(form: PostEditProductBody): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/product/edit`, form);
  }

  getProductDetails(slug: string, populateImages = true): Observable<ProductDetails> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/product/${slug}`).pipe(
      pluck('data'),
      map((p) => ({
        ...p,
        is_downloadable: Boolean(p.is_downloadable),
        is_virtual: Boolean(p.is_virtual),
        discount_end: p.discount_end ? new Date(p.discount_end) : null,
        discount_start: p.discount_start ? new Date(p.discount_start) : null,
        created_at: new Date(p.created_at),
        updated_at: new Date(p.updated_at),
        rating_average: parseFloat(p.rating_average),
        tags: p.tags.map(({ tag_id, title }) => ({ id: tag_id, title })),
      })),
      map((p) =>
        populateImages
          ? {
              ...p,
              image: this.helperService.getImageUrl(p.image, 'product'),
              galleries: p.galleries.map((gallery) => this.helperService.getImageUrl(gallery, 'product')),
            }
          : p
      )
    );
  }

  getTotalNumberOfProducts(userId?: number): Observable<number> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/products`, { params: { user_id: userId } }).pipe(
      pluck('data'),
      map((products) => products.length)
    );
  }

  getProductList(params: GetProductListBody): Observable<ProductList[]> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/products`, params).pipe(
      map((response) =>
        response.data.map((p) => ({
          ...p,
          image: this.helperService.getImageUrl(p.image, 'product', 'thumb'),
          galleries: JSON.parse(p.galleries).map((gallery) =>
            this.helperService.getImageUrl(gallery, 'product', 'thumb')
          ),
          is_downloadable: Boolean(p.is_downloadable),
          is_virtual: Boolean(p.is_virtual),
          discount_end: p.discount_end ? new Date(p.discount_end) : null,
          discount_start: p.discount_start ? new Date(p.discount_start) : null,
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
          rating_average: parseFloat(p.rating_average),
        }))
      )
    );
  }

  getRelatedProducts(slug: string): Observable<ProductList[]> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/product/${slug}/related-products`).pipe(
      map((response) =>
        response.data.map((p) => ({
          ...p,
          image: this.helperService.getImageUrl(p.image, 'product', 'medium'),
          galleries: JSON.parse(p.galleries).map((gallery) =>
            this.helperService.getImageUrl(gallery, 'product', 'thumb')
          ),
          is_downloadable: Boolean(p.is_downloadable),
          is_virtual: Boolean(p.is_virtual),
          discount_end: p.discount_end ? new Date(p.discount_end) : null,
          discount_start: p.discount_start ? new Date(p.discount_start) : null,
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
          rating_average: parseFloat(p.rating_average),
        }))
      )
    );
  }

  getProductReview(id: number): Observable<ProductReview[]> {
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/product/${id}/reviews`).pipe(
      pluck('data'),
      map<any, ProductReview[]>((reviews) =>
        reviews.map((r) => ({
          ...r,
          created_at: new Date(r.created_at),
          user_profile_photo: this.helperService.getImageUrl(r.user_profile_photo, 'users', 'thumb'),
        }))
      )
    );
  }

  postNewProductReview(params: ProductReviewParams): Observable<ProductReview[]> {
    return this.http.post<ApiResponse<any>>(`${this.BASE_URL}/product/${params.product_id}/review`, params).pipe(
      pluck('data'),
      switchMap(() => this.getProductReview(params.product_id))
    );
  }
}
