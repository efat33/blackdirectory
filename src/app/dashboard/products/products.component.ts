import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface Filter {
  category: string;
  keyword: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['image', 'name', 'stock', 'price', 'earning', 'views', 'date'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  filterForm = new FormGroup({
    keyword: new FormControl(''),
    category: new FormControl(''),
  });

  // Category autocomplete
  categoryInput = new FormControl('');
  categories$: Observable<string[]> = this.categoryInput.valueChanges.pipe(
    mergeMap(() => {
      return of(['Category 1', 'Category 2', 'Category 3', 'Category 4']);
    })
  );

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = this.filterer;
  }

  filterer = (data: any, filterStr: string) => {
    const filter: Filter = JSON.parse(filterStr);
    const { category, keyword } = filter;
    if (category && data.category !== category) {
      return false;
    }
    if (keyword && data.title !== keyword) {
      return false;
    }
    return true;
  };

  selectCategory(category: string): void {
    this.filterForm.controls.category.setValue(category);
  }

  checkCategory(): void {
    const selectedCategory = this.filterForm.controls.category.value;
    if (!selectedCategory || selectedCategory !== this.categoryInput.value) {
      this.categoryInput.setValue('');
      this.filterForm.controls.category.setValue('');
    }
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterForm.value);
  }
}
