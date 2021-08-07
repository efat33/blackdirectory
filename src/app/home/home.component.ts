import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';

// import Swiper core and required modules
import SwiperCore, {
  Navigation
} from 'swiper/core';
import { ListingService } from '../listing/listing.service';
import { LoginModal } from '../modals/user/login/login-modal';
import { HelperService } from '../shared/helper.service';

// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  siteUrl:string;
  currentUserID:number;
  subscriptions:any = new Subscription();

  listingSearchForm: FormGroup;
  listingFormError = false;
  errorMessageListingForm = '';

  trendingListings:any;
  feautedListings:any;
  favoriteListings:any = [];
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
    10: 'Excellent'
  }

  constructor(
    private listingService: ListingService,
    private helperService: HelperService,
    public dialog: MatDialog,
    public router: Router,
  ) { }

  breakpoints = {
    640: { slidesPerView: 2, spaceBetween: 10 },
    768: { slidesPerView: 3, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 20 }
  };

  ngOnInit() {
    this.siteUrl = this.helperService.siteUrl;
    if(this.helperService.currentUserInfo?.id) this.currentUserID = this.helperService.currentUserInfo.id;

    this.listingSearchForm = new FormGroup({
      keyword: new FormControl(''),
      address: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl(''),
    });

    this.getTrendingAndFeaturedListings();
  }

  onSubmitListingForm() {
    // generate query params 
    const keyword = this.listingSearchForm.get('keyword').value;
    const address = this.listingSearchForm.get('address').value;
    const lat = this.listingSearchForm.get('lat').value;
    const lng = this.listingSearchForm.get('lng').value;

    // redirect to listing details page
    this.router.navigate([`listing/search`], { queryParams: { keyword: keyword, address: address, lat: lat, lng: lng } });
  }

  onClickListingFavorite(listing_id) {
    
    if(this.helperService.currentUserInfo?.id){
      const subsUpdateFavorite = this.listingService.updateFavorite(listing_id).subscribe(
        (res:any) => {
          const tl = this.trendingListings.find(l => l.id == listing_id);
          tl.is_favorite = !tl.is_favorite;
      
          const fl = this.feautedListings.find(l => l.id == listing_id);
          fl.is_favorite = !fl.is_favorite;
      
        },
        (res:any) => {
          
        }
      );
      
      this.subscriptions.add(subsUpdateFavorite);
    }
    else{
      this.dialog.open(LoginModal, {
        width: '400px'
      });
    }

  }


  getListingImageSrc(src, size = 'full') {
    return this.helperService.getImageUrl(src, 'listing', size);
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
          const tl = this.trendingListings.find(l => l.id == item);
          if(tl) tl.is_favorite = true;

          const fl = this.feautedListings.find(l => l.id == item);
          if(fl) fl.is_favorite = true;
        }

      },
      (error) => {

      }
    );
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
