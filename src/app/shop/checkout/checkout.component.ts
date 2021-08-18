import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helper.service';
import { CartItemPopulated, CartService } from 'src/app/shared/services/cart.service';
import { PostNewOrderParams } from 'src/app/shared/services/order.service';
import { Country, StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  dataSource = new MatTableDataSource<CartItemPopulated>([]);
  displayedColumns = ['product', 'product_price', 'subtotal'];

  subtotal$: Observable<number> = this.cartService.subtotal;
  discountAmount$: Observable<number> = this.cartService.discountAmount;
  total$: Observable<number> = this.cartService.total;
  countries$: Observable<Country[]> = this.storeService.getCountries();

  shippingForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    company_name: new FormControl(''),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    country_id: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    postcode: new FormControl('', [Validators.required]),
  });
  additionalInfo = new FormControl('');

  constructor(
    private cartService: CartService,
    private helperService: HelperService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.cartService.cart
      .pipe(
        map((items) =>
          items.map((item) => ({
            ...item,
            product_image: this.helperService.getImageUrl(item.product_image, 'product', 'thumb'),
          }))
        )
      )
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  onCountrySelectionChange(option: Country): void {
    this.shippingForm.get('country').setValue(option.title);
    this.shippingForm.get('country_id').setValue(option.id);
  }

  onSubmit(): void {
    if (this.shippingForm.invalid) {
      return;
    }
    const sf: {
      address: string;
      city: string;
      company_name?: string;
      country: string;
      country_id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
      postcode: string;
    } = this.shippingForm.value;
    const params: PostNewOrderParams = {
      ...sf,
      additional_info: this.additionalInfo.value,
      items: [],
      shipping: sf,
      subtotal: 100,
      total: 100,
    };
    console.log(params);
  }
}
