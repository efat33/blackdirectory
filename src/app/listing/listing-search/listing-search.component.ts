import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';
import { ListingSearchCatModal } from 'src/app/modals/listing/search/category/listing-search-cat-modal';
import { ListingSearchPriceModal } from 'src/app/modals/listing/search/price/listing-search-price-modal';
import { ListingSearchSortModal } from 'src/app/modals/listing/search/sortby/listing-search-sortby-modal';
import { LoginModal } from 'src/app/modals/user/login/login-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { ListingService } from '../listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/snackbar.service';

declare const google: any;

@Component({
  selector: 'app-listing-search',
  templateUrl: './listing-search.component.html',
  styleUrls: ['./listing-search.component.scss'],
})
export class ListingSearchComponent implements OnInit, AfterViewInit {
  siteUrl: string;
  subscriptions: Subscription = new Subscription();

  listingSearchForm: FormGroup;
  listingFormError = false;
  errorMessageListingForm = '';

  dialogRefCat: any;
  dialogRefPrice: any;
  dialogRefSort: any;

  currentUserLatitude: any = '';
  currentUserLongitude: any = '';

  selectedCategory: string = null;
  selectedPrice: string = null;
  selectedSort: string = 'Descending';
  queryParams = {
    keyword: '',
    lat: null,
    lng: null,
    order: 'desc',
    orderby: 'created_at',
    limit: 12,
    offset: 0,
    page: 1,
    price: '',
    nearme: 0,
    category: '',
    recommended: 0,
    discount: 0,
  };
  categories: any = [];
  listings: any;
  totalListings: any;
  favoriteListings: any = [];
  pagination = {
    totalItems: 0,
    currentPage: 1,
    pageSize: this.queryParams.limit,
    totalPages: 0,
    startPage: 0,
    endPage: 0,
    pages: [],
  };

  locationModified = false;

  constructor(
    public dialog: MatDialog,
    public listingService: ListingService,
    public spinnerService: SpinnerService,
    public snackbar: SnackBarService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.listingSearchForm.controls;
  }

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;

    // get params from url
    const listing_cat = this.route.snapshot.queryParamMap.get('listing_cat');
    if (listing_cat) {
      this.queryParams.category = listing_cat;
    }
    const keyword = this.route.snapshot.queryParamMap.get('keyword');
    const address = this.route.snapshot.queryParamMap.get('address');
    const lat = this.route.snapshot.queryParamMap.get('lat');
    const lng = this.route.snapshot.queryParamMap.get('lng');

    this.listingSearchForm = new FormGroup({
      keyword: new FormControl(keyword ? keyword : ''),
      address: new FormControl(address ? address : ''),
      lat: new FormControl(lat || ''),
      lng: new FormControl(lng || ''),
    });

    this.getCategories();
    this.onSubmitListingForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeGoogleMap();
    }, 100);
  }

  initializeGoogleMap() {
    const latitude = this.listingSearchForm.get('lat');
    const longitude = this.listingSearchForm.get('lng');

    const input = document.querySelector('input[formControlName=address]') as HTMLInputElement;
    console.log("🚀 ~ file: listing-search.component.ts ~ line 117 ~ ListingSearchComponent ~ initializeGoogleMap ~ input", input)
    const address = this.listingSearchForm.get('address');

    const autocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
    };

    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);
    console.log("🚀 ~ file: listing-search.component.ts ~ line 125 ~ ListingSearchComponent ~ initializeGoogleMap ~ autocomplete", autocomplete)

    autocomplete.addListener('place_changed', () => {
      // infowindow.close();
      const place = autocomplete.getPlace();
      console.log("🚀 ~ file: listing-search.component.ts ~ line 130 ~ ListingSearchComponent ~ autocomplete.addListener ~ place", place)

      if (!place.geometry || !place.geometry.location) {
        // window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      address.setValue(place.formatted_address);
      latitude.setValue(place.geometry.location.lat());
      longitude.setValue(place.geometry.location.lng());
      this.locationModified = false;

      this.cdr.detectChanges();
    });
  }

  getCategories() {
    const subsCategories = this.listingService.getCategories().subscribe(
      (res: any) => {
        for (const item of res.data) {
          const tmp = { value: item.id, viewValue: item.title };
          this.categories.push(tmp);
        }
        // get listing category from url
        const listing_cat = this.route.snapshot.queryParamMap.get('listing_cat');
        if (listing_cat) {
          this.selectedCategory = this.categories.find((c) => c.value == listing_cat).viewValue;
        }
      },
      (res: any) => {}
    );

    this.subscriptions.add(subsCategories);
  }

  getListingImageSrc(src, size = 'full') {
    return this.helperService.getImageUrl(src, 'listing', size);
  }

  onClickListingFavorite(listing_id) {
    if (this.helperService.currentUserInfo?.id) {
      const subsUpdateFavorite = this.listingService.updateFavorite(listing_id).subscribe(
        (res: any) => {
          const tl = this.listings.find((l) => l.id == listing_id);
          tl.is_favorite = !tl.is_favorite;
        },
        (res: any) => {}
      );

      this.subscriptions.add(subsUpdateFavorite);
    } else {
      this.dialog.open(LoginModal, {
        width: '400px',
      });
    }
  }

  resetQueryParams() {
    // reset all the params
    this.queryParams.keyword = '';
    this.queryParams.lat = '';
    this.queryParams.lng = '';
    this.queryParams.order = 'desc';
    this.queryParams.orderby = 'created_at';
    this.queryParams.limit = 12;
    this.queryParams.offset = 0;
    this.queryParams.price = '';
    this.queryParams.nearme = 0;
    this.queryParams.category = '';
    this.queryParams.recommended = 0;
    this.queryParams.discount = 0;

    // empty filter texts
    this.selectedCategory = '';
    this.selectedPrice = '';

    // submit the listing form
    this.onSubmitListingForm(true);
  }

  onSubmitListingForm(reset: boolean = false) {
    // first get the keyword value and lat, lng
    if (reset) {
      this.queryParams.keyword = '';
      this.queryParams.lat = '';
      this.queryParams.lng = '';

      this.f.keyword.setValue('');
      this.f.address.setValue('');
      this.f.lat.setValue('');
      this.f.lng.setValue('');
    } else {
      this.queryParams.keyword = this.f.keyword.value;
      this.queryParams.lat = this.f.lat.value;
      this.queryParams.lng = this.f.lng.value;
    }

    const subsSearchL = this.listingService.searchListing(this.queryParams);
    const subsFavoritesL = this.listingService.getFavorites();

    this.spinnerService.show();
    forkJoin([subsSearchL, subsFavoritesL]).subscribe(
      (res: any) => {
        this.spinnerService.hide();

        this.listings = res[0].data.listings;
        this.totalListings = res[0].data.total_listings;
        this.favoriteListings = res[1].data;

        for (const item of this.favoriteListings) {
          const tl = this.listings.find((l) => l.id == item);
          if (tl) tl.is_favorite = true;
        }

        this.setPagination(this.totalListings, this.queryParams.page, this.queryParams.limit);
      },
      (error) => {
        this.spinnerService.hide();
      }
    );
  }

  setPagination(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);

    this.pagination.totalItems = totalItems;
    this.pagination.currentPage = currentPage;
    this.pagination.pageSize = pageSize;
    this.pagination.totalPages = totalPages;
    this.pagination.startPage = startPage;
    this.pagination.endPage = endPage;
    this.pagination.pages = pages;
  }

  onClickPagination(currentPage: number) {
    this.queryParams.page = currentPage;
    this.queryParams.offset = (currentPage - 1) * this.queryParams.limit;
    this.onSubmitListingForm();
  }

  setUserLocation() {
    this.spinnerService.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.currentUserLatitude = pos.coords.latitude;
        this.currentUserLongitude = pos.coords.longitude;

        this.f.lat.setValue(pos.coords.latitude);
        this.f.lng.setValue(pos.coords.longitude);

        this.spinnerService.hide();

        this.onSubmitListingForm();

        this.queryParams.nearme = 1;

      });
    } else {
      this.snackbar.openSnackBar('Geolocation is not supported by this browser.', 'Close', 'warn');
    }
  }

  onClickNearMe() {
    if(this.queryParams.nearme == 0){
      // do near me search
      if(!this.currentUserLatitude || !this.currentUserLongitude){
        this.setUserLocation();
      }
      else{
        this.f.lat.setValue(this.currentUserLatitude);
        this.f.lng.setValue(this.currentUserLongitude);
        this.onSubmitListingForm();

        this.queryParams.nearme = 1;
      }
      
    }
    else{
      this.f.lat.setValue('');
      this.f.lng.setValue('');
      this.onSubmitListingForm();
      
      this.queryParams.nearme = 0;
    }
    
  }

  openListingSortModal(): void {
    this.dialogRefSort = this.dialog.open(ListingSearchSortModal, {
      width: '400px',
      data: { sortby: this.queryParams.order },
    });

    this.dialogRefSort.afterClosed().subscribe((result) => {
      this.queryParams.order = result.value;
      this.selectedSort = result.viewValue;
      this.onSubmitListingForm();
    });

    this.subscriptions.add(this.dialogRefSort);
  }

  openListingCategoryModal(): void {
    this.dialogRefCat = this.dialog.open(ListingSearchCatModal, {
      width: '400px',
      data: { category: this.queryParams.category, categories: this.categories },
    });

    this.dialogRefCat.afterClosed().subscribe((result) => {
      this.queryParams.category = result.value;
      this.selectedCategory = result.viewValue;
      this.onSubmitListingForm();
    });

    this.subscriptions.add(this.dialogRefCat);
  }

  openListingPriceModal(): void {
    this.dialogRefPrice = this.dialog.open(ListingSearchPriceModal, {
      width: '400px',
      data: { price: this.queryParams.price },
    });

    this.dialogRefPrice.afterClosed().subscribe((result) => {
      this.queryParams.price = result.value;
      this.selectedPrice = result.viewValue;
      this.onSubmitListingForm();
    });

    this.subscriptions.add(this.dialogRefPrice);
  }

  onLocationBlur() {
    if (this.locationModified) {
      this.listingSearchForm.patchValue({
        lat: '',
        lng: '',
        address: '',
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
