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
    });
    this.trackCategoryChange();
    this.categories.valueChanges.subscribe(() => {
      const options = this.getSelectableOptions();
      this.updateOptionControls(options);
    });
  }

  ngOnChanges(): void {
    console.log(this.currentValues);

    if (this.currentValues) {
      const categories = this.currentValues.categories;
      this.categories.patchValue(categories);
      this.updateCategoryControls({ value: categories[categories.length - 1], index: categories.length - 1 });
    }
  }

  trackCategoryChange(): void {
    this.categoryChange = merge(
      ...this.categories.controls.map((control, index) => control.valueChanges.pipe(map((value) => ({ value, index }))))
    );
    this.categoryChangeSub?.unsubscribe();
    this.categoryChangeSub = this.categoryChange.subscribe((change) => this.updateCategoryControls(change));
  }

  updateCategoryControls(change: { value: number; index: number }): void {
    while (this.categories.length > change.index + 1) {
      this.categories.removeAt(change.index + 1);
    }
    if (this.getSubcategories(change.value).length > 0) {
      this.categories.push(new FormControl(null));
    }
    this.trackCategoryChange();
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
                  checked: new FormControl(false),
                })
            )
          ),
        })
      );
    });
  }
}
