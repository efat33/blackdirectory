import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ShippingOption, ShippingService } from './shipping.service';

export interface ShippingOptionForm {
  vendorId: number;
  vendorName: string;
  options: ShippingOption[];
  selectedOption: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShippingOptionsService {
  form = new FormArray([]);
  totalShippingCost$ = this.form.valueChanges.pipe(
    startWith([]),
    shareReplay(1),
    map((values) =>
      values.reduce((acc, { options, selectedOption }) => acc + this.getSelectedOptionFee(options, selectedOption), 0)
    ),
    map((cost) => (isNaN(cost) || cost < 0 ? 0 : cost))
  );

  constructor(private shippingService: ShippingService) {}

  private isVendorInForm(id: number): boolean {
    return this.form.value.findIndex((option) => option.vendorId === id) > -1;
  }

  private createShippingOptionFormGroup(vendorName: string, vendorId: number, options: ShippingOption[]): FormGroup {
    return new FormGroup({
      vendorName: new FormControl(vendorName),
      vendorId: new FormControl(vendorId),
      options: new FormControl(options),
      selectedOption: new FormControl(null, [Validators.required]),
    });
  }

  private getShippingOptions(vendors: Map<number, string>, countryID?: number): Observable<ShippingOptionForm[]> {
    return forkJoin(
      Array.from(vendors.keys()).map((vendor) =>
        this.shippingService.getShippingMethods(vendor).pipe(
          map<ShippingOption[], ShippingOptionForm | null>((options) => {
            const filteredOptions = options.filter((option: ShippingOption) => option.zones.includes(countryID));

            if (options.length > 0) {
              return {
                vendorId: options[0].vendor_id,
                vendorName: vendors.get(options[0].vendor_id),
                options: filteredOptions,
                selectedOption: options[0].id,
              };
            }

            return {
              vendorId: null,
              vendorName: null,
              options: null,
              selectedOption: null,
            };
          })
        )
      )
    ).pipe(map((data) => data.filter((item) => item != null)));
  }

  private getSelectedOptionFee(options: ShippingOption[], selectedOption: number): number {
    return options.find((opt) => opt.id === selectedOption)?.fee || 0;
  }

  extractVendorsFromItems(
    items: { vendor_id: number; vendor_display_name?: string; vendor_username?: string }[]
  ): Map<number, string> {
    const vendorsMap = new Map<number, string>();
    items
      .filter((item) => item.vendor_id)
      .forEach((item) => {
        vendorsMap.set(item.vendor_id, item.vendor_display_name || item.vendor_username || '');
      });
    return vendorsMap;
  }

  updateShippingOptionsForm(vendors: Map<number, string>, countryID?: number): void {
    while (this.form.length !== 0) {
      this.form.removeAt(0);
    }

    // Add new FormGroups for non-existent vendors
    this.getShippingOptions(vendors, countryID).subscribe((items) => {
      items.forEach((item) => {
        this.form.push(this.createShippingOptionFormGroup(item.vendorName, item.vendorId, item.options));
      });
    });
  }

  getShippingIds(): { vendor_id: number; shipping_id: number }[] {
    return (this.form.value as ShippingOptionForm[]).map((data) => ({
      vendor_id: data.vendorId,
      shipping_id: data.selectedOption,
    }));
  }
}
