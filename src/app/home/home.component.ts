import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper/core';
import { EventService } from '../events/event.service';
import { ListingService } from '../listing/listing.service';
import { NewsService } from '../news/news.service';
import { HelperService } from '../shared/helper.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { HomeService } from './home.service';
import { UserService } from '../user/user.service';
import { SeoService } from '../shared/services/seo.service';

declare const google: any;

// install Swiper modules
SwiperCore.use([Navigation]);



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  siteUrl: string;
  currentUserID: number;
  subscriptions: any = new Subscription();

  listingSearchForm: FormGroup;
  listingFormError = false;
  errorMessageListingForm = '';

  events: any;
  trendingCategories: any;
  trendingListings: any;
  feautedListings: any;
  favoriteListings: any = [];
  review_comment = {
    1: 'Terrible',
    2: 'Terrible',
    3: 'Terrible',
    4: 'Terrible',
    5: 'Poor',
    6: 'Poor',
    7: 'Poor',
    8: 'Average',
    9: 'Very Good',
    10: 'Excellent',
  };

  news: any[];

  locationModified = false;

  constructor(
    private userService: UserService,
    private listingService: ListingService,
    private homeService: HomeService,
    private eventService: EventService,
    private newsService: NewsService,
    private helperService: HelperService,
    public dialog: MatDialog,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private seo: SeoService
  ) {}

  breakpoints = {
    640: { slidesPerView: 2, spaceBetween: 10 },
    768: { slidesPerView: 3, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 20 },
  };

  ngOnInit() {

    // setup SEO data
    this.seo.generateTags({
      title: 'Home', 
      description: 'Description Home Page', 
      image: 'https://www.blackdirectory.co.uk/wp-content/uploads/2020/08/BD-LOGO-1.png',
      slug: 'home',
      keywords: 'home, BD home',
    });

    this.siteUrl = this.helperService.siteUrl;
    if (this.helperService.currentUserInfo?.id) this.currentUserID = this.helperService.currentUserInfo.id;

    this.listingSearchForm = new FormGroup({
      keyword: new FormControl(''),
      address: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl(''),
    });

    this.getTrendingAndFeaturedListings();

    this.getEvents();
    this.getTrendingCategories();
    this.getNews();
    this.initiateGallery();
    this.populateGallery();
  }

  ngAfterViewInit() {
   
  }

  initiateGallery() {
    this.galleryOptions = [
      {
          width: '100%',
          height: '100%',
          imageAnimation: NgxGalleryAnimation.Fade,
          imageAutoPlayInterval: 4000,
          preview: false,
          imageArrows: false,
          imageSwipe: true,
          imageAutoPlay: true,
          imageInfinityMove: true,
          thumbnails: false
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '100%',
          imagePercent: 80,
          thumbnails: false,
          imageSwipe: true,
          preview: false
      },
      // max-width 400
      {
          breakpoint: 400,
          thumbnails: false,
          imageSwipe: true,
          preview: false
      }
    ];
  }

  populateGallery() {

    const subsHeroSlides = this.homeService.getHeroSlides().subscribe(
      (res:any) => {
        const galleries = res.data;
        for (const item of galleries) {
          const obj = {
            small: this.helperService.getImageUrl(item.image, 'gallery', 'medium'),
            medium: this.helperService.getImageUrl(item.image, 'gallery'),
            big: this.helperService.getImageUrl(item.image, 'gallery')
          }

          this.galleryImages.push(obj);
        }
        // initiate google autocomplete
        setTimeout(() => {
          this.initializeGoogleMap();
        }, 100);
      },
      (res:any) => {

      }
    );

    this.subscriptions.add(subsHeroSlides);


  }

  initializeGoogleMap() {
    const latitude = this.listingSearchForm.get('lat');
    const longitude = this.listingSearchForm.get('lng');

    const input = document.querySelector('input[formControlName=address]') as HTMLInputElement;
    const address = this.listingSearchForm.get('address');
    
    const autocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
    };

    const autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);

    autocomplete.addListener('place_changed', () => {
      // infowindow.close();
      const place = autocomplete.getPlace();

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

  getTrendingCategories() {
    const subsTrendingCategories = this.listingService.getTrendingCategories().subscribe(
      (res: any) => {
        this.trendingCategories = res.data;
      },
      (res: any) => {}
    );

    this.subscriptions.add(subsTrendingCategories);
  }

  getEvents() {
    const queryParams = { limit: 3 };
    const subsHomeEvents = this.eventService.searchEvent(queryParams).subscribe(
      (res: any) => {
        this.events = res.data.events;
      },
      (res: any) => {}
    );

    this.subscriptions.add(subsHomeEvents);
  }

  getNews() {
    const subscription = this.newsService.getNewsByQuery({}, 3).subscribe(
      (result: any) => {
        this.news = result.data;

        for (const news of this.news) {
          news.featured_image = this.helperService.getImageUrl(news.featured_image, 'news');
        }
      },
      (error) => {}
    );

    this.subscriptions.add(subscription);
  }

  onSubmitListingForm() {
    // generate query params
    const keyword = this.listingSearchForm.get('keyword').value;
    const address = this.listingSearchForm.get('address').value;
    const lat = this.listingSearchForm.get('lat').value;
    const lng = this.listingSearchForm.get('lng').value;

    // redirect to listing details page
    this.router.navigate([`listing/search`], {
      queryParams: { keyword: keyword, address: address, lat: lat, lng: lng },
    });
  }

  onClickListingFavorite(listing_id) {
    if (this.helperService.currentUserInfo?.id) {
      const subsUpdateFavorite = this.listingService.updateFavorite(listing_id).subscribe(
        (res: any) => {
          const tl = this.trendingListings.find((l) => l.id == listing_id);
          tl.is_favorite = !tl.is_favorite;

          const fl = this.feautedListings.find((l) => l.id == listing_id);
          fl.is_favorite = !fl.is_favorite;
        },
        (res: any) => {}
      );

      this.subscriptions.add(subsUpdateFavorite);
    } else {
      this.userService.onLoginLinkModal.emit();
    }
  }

  getTrendingAndFeaturedListings() {
    const subsTrendL = this.listingService.getListings('4/0/view');
    const subsFeaturedL = this.listingService.getListings('8/0/view/featured');
    const subsFavoritesL = this.listingService.getFavorites();

    forkJoin([subsTrendL, subsFeaturedL, subsFavoritesL]).subscribe(
      (res: any) => {
        this.trendingListings = res[0].data;
        this.feautedListings = res[1].data;
        this.favoriteListings = res[2].data;

        for (const item of this.favoriteListings) {
          const tl = this.trendingListings.find((l) => l.id == item);
          if (tl) tl.is_favorite = true;

          const fl = this.feautedListings.find((l) => l.id == item);
          if (fl) fl.is_favorite = true;
        }
      },
      (error) => {}
    );
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
