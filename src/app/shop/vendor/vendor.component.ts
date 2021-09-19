import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { ProductList } from 'src/app/shared/services/product.service';
import { StoreInformation } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
})
export class VendorComponent implements OnInit {
  vendor: StoreInformation;
  products: ProductList[];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(pluck<Data, { vendorInfo: StoreInformation; vendorProducts: ProductList[] } | undefined>('data'))
      .subscribe((data) => {
        this.vendor = data?.vendorInfo;
        this.products = data?.vendorProducts;
      });
  }
}
