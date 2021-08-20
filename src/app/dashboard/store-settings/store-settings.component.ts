import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Country, PostStoreSettingsBody, StoreService } from 'src/app/shared/services/store.service';

interface AddressParams {
  street: string;
  street_2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Component({
  selector: 'app-store-settings',
  templateUrl: './store-settings.component.html',
  styleUrls: ['./store-settings.component.css'],
})
export class StoreSettingsComponent implements OnInit {
  settingsForm = new FormGroup({
    store_name: new FormControl('', [Validators.required]),
    profile_picture: new FormControl(null, [Validators.required]),
    banner: new FormControl(null),
    product_per_page: new FormControl(10, [Validators.required]),
    show_more_products: new FormControl(true, [Validators.required]),
    street: new FormControl('', [Validators.required]),
    street_2: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    show_email: new FormControl(false, [Validators.required]),
  });

  // Show error if any
  showError = false;
  errorMessage = '';

  countries$: Observable<Country[]> = this.storeService.getCountries();

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService) {}

  private mergeAddress(params: AddressParams): string {
    const { street, street_2, city, state, zip, country } = params;
    return `${street}, ${street_2 ? street_2 + ', ' : ''}${city}, ${zip}, ${state}, ${country}`;
  }

  private parseAddress(address: string): AddressParams {
    const params = address.split(', ');
    if (params.length === 5) {
      const [street, city, zip, state, country] = params;
      return { street, street_2: '', city, zip, state, country };
    } else if (params.length === 6) {
      const [street, street_2, city, zip, state, country] = params;
      return { street, street_2, city, zip, state, country };
    } else {
      return {
        street: '',
        street_2: '',
        city: '',
        zip: '',
        state: '',
        country: '',
      };
    }
  }

  initForm(): void {
    this.activatedRoute.data.pipe(pluck('store')).subscribe((d) => {
      console.log(d);

      const { street, street_2, city, state, zip, country } = this.parseAddress(d.address);
      this.settingsForm.patchValue({
        ...d,
        street,
        street_2,
        city,
        state,
        zip,
        country,
      });
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      return;
    }
    const f = this.settingsForm.value;
    const params: PostStoreSettingsBody = {
      store_name: f.store_name,
      profile_picture: f.profile_picture,
      banner: f.banner,
      phone: f.phone,
      show_email: f.show_email,
      address: this.mergeAddress(f),
      product_per_page: f.product_per_page,
      show_more_products: f.show_more_products,
    };
    console.log(params);
    this.storeService.postStoreSettings(params).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

/*
  uptime: new FormGroup({
    show_uptime: new FormControl(true),
    sunday: new FormGroup({
      up: new FormControl(false),
      opens: new FormControl(''),
      closes: new FormControl(''),
    }),
    monday: new FormGroup({
      up: new FormControl(true),
      opens: new FormControl(''),
      closes: new FormControl(''),
    }),
    tuesday: new FormGroup({
      up: new FormControl(true),
      opens: new FormControl(''),
      closes: new FormControl(''),
    }),
    wednesday: new FormGroup({
      up: new FormControl(true),
      opens: new FormControl(''),
      closes: new FormControl(''),
    }),
    thursday: new FormGroup({
      up: new FormControl(true),
      opens: new FormControl(''),
      closes: new FormControl(''),
    }),
    friday: new FormGroup({
      up: new FormControl(true),
      opens: new FormControl(''),
      closes: new FormControl(''),
    }),
    saturday: new FormGroup({
      up: new FormControl(false),
      opens: new FormControl(''),
      closes: new FormControl(''),
    }),
    open_notice: new FormControl(''),
    close_notice: new FormControl(''),
  }),

  days: { label: string; value: string }[] = days;
  hours: string[] = hours;

  getUptimeDayCtrl(day: string): AbstractControl {
    return this.settingsForm.get(`uptime.${day}`);
  }

*/
