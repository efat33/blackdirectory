import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, ProductDetails, ProductService } from 'src/app/shared/services/product.service';

type OptionSelection = { label: string; option_id: number; options: { id: number; title: string }[] };

@Component({
  selector: 'app-product-category-selector',
  templateUrl: './product-category-selector.component.html',
  styleUrls: ['./product-category-selector.component.css'],
})
export class ProductCategorySelectorComponent implements OnInit, OnChanges {
  @Input() categories: FormArray;
  @Input() options: FormArray;
  @Input() currentValues: ProductDetails;

  rootCategories: Category[];
  categoryChange: Observable<{ value: number; index: number }>;
  categoryChangeSub: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe((res) => {
      this.rootCategories = res;
      if (this.currentValues) {
        const categories = this.currentValues.categories;
        categories.forEach((c, i) => {
          this.onCategoryChange(i, c.id);
          this.categories.controls[i].patchValue(c.id, { emitEvent: false });
        });
        const options = this.getSelectableOptions();
        this.updateOptionControls(options);
      }
    });
    this.categories.valueChanges.subscribe((value) => {
      const options = this.getSelectableOptions();
      this.updateOptionControls(options);
    });
  }

  ngOnChanges(): void {}

  onCategoryChange(index: number, value: number): void {
    while (this.categories.length > index + 1) {
      this.categories.removeAt(index + 1);
    }
    if (this.getSubcategories(value).length > 0) {
      this.categories.push(new FormControl(null));
    }
  }

  findCategoryinSubtree = (id: number, root: Category): Category | null => {
    if (root.id === id) {
      return root;
    }

    let i = 0;
    let found = null;
    while (!found && i < root?.subCategories?.length) {
      found = this.findCategoryinSubtree(id, root.subCategories[i]);
      i++;
    }
    return found;
  };

  findCategory = (id: number): Category | null => {
    let i = 0;
    let found = null;
    while (!found && i < this.rootCategories.length) {
      found = this.findCategoryinSubtree(id, this.rootCategories[i]);
      i++;
    }
    return found;
  };

  getSubcategories(parentCategoryId: number): Category[] {
    const parentCategory = this.findCategory(parentCategoryId);
    return parentCategory?.subCategories || [];
  }

  getSelectableOptions(): OptionSelection[] {
    const options: OptionSelection[] = [];
    const selectedCategories = this.categories.value.filter((v) => v != null);
    selectedCategories.forEach((categoryId) => {
      const optss = this.findCategory(categoryId).options;
      options.push(
        ...optss.map((opts) => ({
          label: opts[0].option,
          option_id: opts[0].option_id,
          options: opts
            .sort((a, b) => (a.choice_order > b.choice_order ? 1 : -1))
            .map((o) => ({ id: o.id, title: o.title })),
        }))
      );
    });
    return options;
  }

  updateOptionControls(options: OptionSelection[]): void {
    while (this.options.length > 0) {
      this.options.removeAt(0);
    }
    const uniqueOptions = new Map<string, OptionSelection>();
    options.forEach((option) => {
      if (!uniqueOptions.has(option.label)) {
        uniqueOptions.set(option.label, option);
      }
    });
    options = Array.from(uniqueOptions.values());
    const selectedChoices: number[] =
      this.currentValues?.options
        .reduce(
          (
            acc: {
              id: number;
              title: string;
            }[],
            opt
          ) => [...acc, ...opt.choices],
          []
        )
        .map((c) => c.id) || [];
    options.forEach((option) => {
      this.options.push(
        new FormGroup({
          label: new FormControl(option.label),
          option_id: new FormControl(option.option_id),
          choices: new FormArray(
            option.options.map(
              (opt) =>
                new FormGroup({
                  label: new FormControl(opt.title),
                  id: new FormControl(opt.id),
                  checked: new FormControl(selectedChoices.includes(opt.id)),
                })
            )
          ),
        })
      );
    });
  }
}
