import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ShippingOption } from 'src/app/shared/services/shipping.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[app-shipping-method-selector]',
  templateUrl: './shipping-method-selector.component.html',
  styleUrls: ['./shipping-method-selector.component.css'],
})
export class ShippingMethodSelectorComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() {}

  get vendorName(): string {
    return this.form.get('vendorName').value;
  }
  get options(): ShippingOption[] {
    return this.form.get('options').value;
  }
  get selectedOptionFormControl(): FormControl {
    return this.form.get('selectedOption') as FormControl;
  }

  get selectedOptionFee(): number {
    const { options, selectedOption } = this.form.value;
    return options.find((opt) => opt.id === selectedOption)?.fee || 0;
  }

  ngOnInit(): void {}
}
