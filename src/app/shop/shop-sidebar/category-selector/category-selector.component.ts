import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, distinctUntilChanged, map, mergeMap, mergeMapTo, pluck, tap } from 'rxjs/operators';
import { Category, ProductService } from 'src/app/shared/services/product.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';

interface CategoryNode {
  id: number;
  name: string;
  children?: CategoryNode[];
}

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.css'],
})
export class CategorySelectorComponent implements OnInit {
  treeControl = new NestedTreeControl<CategoryNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  activeCategoryId: number;

  allCategories: Category[];
  filters = new FormArray([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private snackbar: SnackBarService,
    private router: Router
  ) {}

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  private isLeaf(node: CategoryNode): boolean {
    return !node.children || node.children.length === 0;
  }

  private mapApiCategoryToCategoryNode(category: Category): CategoryNode {
    return {
      id: category.id,
      name: category.title,
      children: category.subCategories?.map((c) => this.mapApiCategoryToCategoryNode(c)) || [],
    };
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
    while (!found && i < this.allCategories.length) {
      found = this.findCategoryinSubtree(id, this.allCategories[i]);
      i++;
    }
    return found;
  };

  updateFiltersFormArray(
    options: {
      id: number;
      choice_order: number;
      option: string;
      option_id: number;
      title: string;
    }[][],
    activeChoices: number[]
  ): void {
    while (this.filters.length > 0) {
      this.filters.removeAt(0);
    }
    options.forEach((option) => {
      this.filters.push(
        new FormGroup({
          label: new FormControl(option[0].option),
          options: new FormArray(
            option.map(
              (opt) =>
                new FormGroup({
                  title: new FormControl(opt.title),
                  id: new FormControl(opt.id),
                  checked: new FormControl(activeChoices.includes(opt.id) ? true : false),
                })
            )
          ),
        })
      );
    });
  }

  ngOnInit(): void {
    this.productService
      .getCategories()
      .pipe(
        catchError(() => {
          this.snackbar.openSnackBar('An error occured while retrieving category list.');
          return of([] as Category[]);
        }),
        tap((res) => (this.allCategories = res)),
        map((res) => res.map((c) => this.mapApiCategoryToCategoryNode(c))),
        tap((categories) => {
          this.dataSource.data = categories;
        }),
        mergeMapTo(
          this.activatedRoute.queryParams.pipe(
            map(({ category, choices }) => ({ category, choices })),
            distinctUntilChanged()
          )
        ),
        map(({ category, choices }) => ({
          category: parseInt(category),
          choices: typeof choices === 'string' ? [parseInt(choices)] : choices?.map((c) => parseInt(c)) || [],
        }))
      )
      .subscribe(({ category, choices }) => {
        this.activeCategoryId = category;
        this.dataSource.data.forEach((node) => this.shouldExpandSubtree(node, category));
        this.updateFiltersFormArray(this.findCategory(category)?.options || [], choices);
      });
  }

  isActive(node: CategoryNode): boolean {
    return this.activeCategoryId === node.id;
  }

  shouldExpandSubtree = (head: CategoryNode, activeCategoryId: number): boolean => {
    if (activeCategoryId !== head.id && this.isLeaf(head)) {
      return false;
    }
    const shouldExpandSubtree =
      activeCategoryId === head.id ||
      head.children.reduce((acc, node) => acc || this.shouldExpandSubtree(node, activeCategoryId), false);
    if (shouldExpandSubtree) {
      this.treeControl.expand(head);
    } else {
      this.treeControl.collapse(head);
    }
    return shouldExpandSubtree;
  };

  onFiltersChange(): void {
    const choices = this.filters.value.reduce(
      (acc, filter) => [
        ...acc,
        ...filter.options
          .filter((opt) => opt.checked)
          .map((opt) => opt.id)
          .reduce((acc, opt) => [...acc, opt], []),
      ],
      []
    );
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { choices },
      queryParamsHandling: 'merge',
    });
  }
}
