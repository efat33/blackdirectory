import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ShippingOption, ShippingService } from 'src/app/shared/services/shipping.service';
import { Country, StoreService } from 'src/app/shared/services/store.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
})
export class ShippingComponent implements OnInit {
  subscriptions: Subscription = new Subscription();

  f = new FormGroup({
    id: new FormControl(null),
    title: new FormControl('', [Validators.required]),
    zones: new FormControl('', [Validators.required]),
    fee: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  options: ShippingOption[] = [];

  countries: Observable<Country[]> = this.storeService.getCountries();

  countriesObj: any = {};

  constructor(
    private snackbar: SnackBarService,
    private shippingService: ShippingService,
    private storeService: StoreService,
    ) {}

  get isEditing(): boolean {
    return this.f.get('id').value !== null;
  }

  get editingOptionId(): number {
    if (this.isEditing) {
      return this.f.get('id').value;
    } else {
      return -1;
    }
  }

  ngOnInit(): void {
    this.getCountries();

    const subsShippingMethods = this.shippingService.getShippingMethods().subscribe(
      (res) => {
        this.options = res;
      },
      (err) => {
        this.snackbar.openSnackBar('An error occured while retrieving shipping options.');
      }
    );

    this.subscriptions.add(subsShippingMethods);

  }

  getCountries() {
    const subsCountries = this.storeService.getCountries().subscribe(
      (res) => {
        res.map(country => {
          this.countriesObj[country.id] = country.title;
        })
      },
      (err) => {

      }
    );

    this.subscriptions.add(subsCountries);
  }

  getShippingCountries(ids: any) {
    const countries = [];
    for (const [i, item] of ids.entries()) {
      countries.push(this.countriesObj[item]);
    }
    return countries.join(', ');
  }

  removeOption(optionId: number): void {
    const i = this.options.findIndex((opt) => opt.id === optionId);
    if (!confirm(`Are you sure you want to remove "${this.options[i].title}" from shipping options?`)) {
      return;
    }
    this.shippingService.delShippingMethod(optionId).subscribe(
      (res) => {
        this.options = res;
        this.snackbar.openSnackBar(`${this.options[i].title} has been removed from shipping options.`);
      },
      (err) => {
        this.snackbar.openSnackBar(`An error occured while removing ${this.options[i].title}`);
      }
    );
  }

  editOption(): void {
    if (!this.isEditing || this.f.invalid) {
      return;
    }
    const { id, title, zones, fee } = this.f.value;
    this.shippingService
      .putShippingMethod(id, {
        title,
        zones,
        fee,
        shipping_order: this.options.find((o) => o.id === id).shipping_order,
      })
      .subscribe(
        (res) => {
          this.options = res;
          this.snackbar.openSnackBar(`${title} has been updated.`);
        },
        (err) => {
          this.snackbar.openSnackBar(`An error occured while updating ${title}`);
        }
      );
    this.f.reset();
  }

  addOption(): void {
    if (this.f.invalid) {
      return;
    }
    const { title, zones, fee } = this.f.value;
    this.shippingService
      .postShippingMethod({
        title,
        zones,
        fee,
        shipping_order: (this.options[this.options.length - 1]?.shipping_order || 0) + 1,
      })
      .subscribe(
        (res) => {
          this.options = res;
          this.snackbar.openSnackBar(`${title} has been added to shipping options.`);
        },
        (err) => {
          this.snackbar.openSnackBar(`An error occured while adding ${title} to shipping options.`);
        }
      );
    this.f.reset();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
