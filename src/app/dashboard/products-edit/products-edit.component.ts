import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.css'],
})
export class ProductsEditComponent implements OnInit {
  productForm = new FormGroup({
    title: new FormControl(''),
    price: new FormControl(0),
    discounted_price: new FormControl(0),
    discount_start: new FormControl(null),
    discount_end: new FormControl(null),
    category: new FormControl(null),
    tags: new FormControl([]),
    image: new FormControl(null),
    galleries: new FormControl([]),
    short_desc: new FormControl(''),
    description: new FormControl(''),
    sku: new FormControl(''),
    stock_management_enabled: new FormControl(false),
    stock_status: new FormControl(''),
    stock_quantity: new FormControl(0),
    purchase_note: new FormControl(''),
    virtual: new FormControl(false),
    downloadable: new FormControl(false),
    file_name: new FormControl(''),
    file: new FormControl(null),
  });

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: { product: any }) => {
      console.log(data.product);
      // TODO: Populate form
    });
  }
}
