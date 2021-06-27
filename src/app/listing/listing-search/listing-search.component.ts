import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ListingSearchCatModal } from 'src/app/modals/listing/search/category/listing-search-cat-modal';
import { ListingSearchPriceModal } from 'src/app/modals/listing/search/price/listing-search-price-modal';
import { ListingSearchSortModal } from 'src/app/modals/listing/search/sortby/listing-search-sortby-modal';

@Component({
  selector: 'app-listing-search',
  templateUrl: './listing-search.component.html',
  styleUrls: ['./listing-search.component.scss']
})

export class ListingSearchComponent implements OnInit {

  subscriptions: Subscription = new Subscription();

  listingSearchForm: FormGroup;
  listingFormError = false;
  errorMessageListingForm = '';

  dialogRefCat: any;
  dialogRefPrice: any;
  dialogRefSort: any;

  selectedCategory: string = null;
  selectedPrice: string = null;
  selectedSort: string = null;
  queryParams = { 
    category: null,
    price: null,
    sortby: null,
  };

  constructor(
    public dialog: MatDialog,
  ) { }


  ngOnInit() {
    this.listingSearchForm = new FormGroup({
      keyword: new FormControl('', Validators.required)
    });
  }

  onSubmitListingForm() {
    
  }

  openListingSortModal(): void {
    this.dialogRefSort = this.dialog.open(ListingSearchSortModal, {
      width: '400px',
      data: { sortby: this.queryParams.sortby}
    });

    this.dialogRefSort.afterClosed().subscribe((result) => {
      this.queryParams.sortby = result.value;
      this.selectedSort = result.viewValue;
      // TODO: call the function which would handle the entire search query

    });

    this.subscriptions.add(this.dialogRefSort);

  }

  openListingCategoryModal(): void {
    this.dialogRefCat = this.dialog.open(ListingSearchCatModal, {
      width: '400px',
      data: { category: this.queryParams.category}
    });

    this.dialogRefCat.afterClosed().subscribe((result) => {
      this.queryParams.category = result.value;
      this.selectedCategory = result.viewValue;
      // TODO: call the function which would handle the entire search query

    });

    this.subscriptions.add(this.dialogRefCat);

  }

  openListingPriceModal(): void {
    this.dialogRefPrice = this.dialog.open(ListingSearchPriceModal, {
      width: '400px',
      data: { price: this.queryParams.price}
    });

    this.dialogRefPrice.afterClosed().subscribe((result) => {
      this.queryParams.price = result.value;
      this.selectedPrice = result.viewValue;
      // TODO: call the function which would handle the entire search query

    });

    this.subscriptions.add(this.dialogRefPrice);

  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}

