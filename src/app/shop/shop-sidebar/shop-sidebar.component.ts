import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ProductService } from 'src/app/shared/services/product.service';

interface Vendor {
  id: number;
  display_name: string;
  username: string;
}

@Component({
  selector: 'app-shop-sidebar',
  templateUrl: './shop-sidebar.component.html',
  styleUrls: ['./shop-sidebar.component.css'],
})
export class ShopSidebarComponent implements OnInit {
  vendors = new FormArray([]);
  viewAllVendors = false;

  priceMin = 0;
  priceMax = 500;
  priceControl = new FormControl([this.priceMin, this.priceMax]);

  reviewControl = new FormControl();

  constructor(private productService: ProductService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.queryParams.pipe(
        map<Params, Params>((params) => ({
          ...params,
          brands:
            Symbol.iterator in Object(params.brands) && typeof params.brands !== 'string'
              ? params.brands
              : [params.brands],
        })),
        map((params) => ({
          price_min: parseInt(params.price_min),
          price_max: parseInt(params.price_max),
          brands:
            Symbol.iterator in Object(params.brands)
              ? params.brands.map((b) => parseInt(b)) || []
              : [parseInt(params.brand)],
          rating: parseInt(params.rating),
        }))
      ),
      this.productService.getFilterOptions(),
    ])
      .pipe(
        map((values) => ({
          queryParams: values[0],
          filters: values[1],
        }))
      )
      .subscribe((values) => {
        this.priceControl.setValue([
          values.queryParams.price_min ? values.queryParams.price_min : values.filters.price.min,
          values.queryParams.price_max ? values.queryParams.price_max : values.filters.price.max,
        ]);
        this.priceMax = values.filters.price.max;
        this.priceMin = values.filters.price.min;
        if (values.queryParams.rating) {
          this.reviewControl.setValue(values.queryParams.rating);
        }
        while (this.vendors.length > 0) {
          this.vendors.removeAt(0);
        }
        values.filters.brands.forEach((vendor) => {
          this.vendors.push(
            new FormGroup({
              name: new FormControl(vendor.display_name),
              id: new FormControl(vendor.id),
              checked: new FormControl(values.queryParams.brands.includes(vendor.id)),
            })
          );
        });
      });
  }

  onFiltersChange(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        price_min: this.priceControl.value[0],
        price_max: this.priceControl.value[1],
        brands: this.vendors.value.filter((v) => v.checked).map((v) => v.id),
        rating: this.reviewControl.value,
      },
      queryParamsHandling: 'merge',
    });
  }
}
