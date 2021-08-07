import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContactOwnerModal } from 'src/app/modals/listing/details/contact-owner/contact-owner-modal';
import { HelperService } from 'src/app/shared/helper.service';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';
import { ListingService } from '../listing.service';
import { ListingGalleryModal } from 'src/app/modals/listing/details/gallery/listing-gallery-modal';
import { ListingVideoModal } from 'src/app/modals/listing/details/video/listing-video-modal';
import * as moment from 'moment';
import { CouponModal } from 'src/app/modals/listing/details/coupon/coupon-modal';
import { ListingReviewModal } from 'src/app/modals/listing/details/review/listing-review-modal';
import { LoginModal } from 'src/app/modals/user/login/login-modal';
import { HttpClient } from '@angular/common/http';
import { ConfirmationDialog } from 'src/app/modals/confirmation-dialog/confirmation-dialog';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss']
})

export class ListingDetailsComponent implements OnInit {

  siteUrl: string;
  assetUrl: string;

  subscriptions: Subscription = new Subscription();

  listing_slug:string;
  showEditButton:boolean = false;
  showSubmitButton:boolean = false;

  listing:any = {};
  listing_owner:any = {};
  listing_categories:any = [];
  listing_galleries:any = [];
  listing_videos:any = [];
  listing_contact:any = {};
  listing_coupon:any = {};
  listing_hours:any = [];
  listing_menus:any = [];

  favoriteListings:any = [];

  listing_reviews:any = [];
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
  currentUserCanReview:boolean = true;
  currentUserReview:any;
  clientIP:any;

  current_weekday:any;
  isTodayOpen:boolean;
  cover_img = '';
  logo = '';
  featured_img = '';

  current_tab:string = 'home';
  isReviewDotsClicked = [];
  isCommentDotsClicked = [];
  isCommentEditClicked = [];

  dialogReview: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private listingService: ListingService,
    private helperservice: HelperService,
    private userService: UserService,
    private spinnerService: SpinnerService,
    public router: Router,
    private snackbar: SnackBarService,
    private http:HttpClient
  ) { }


  ngOnInit() {

    this.siteUrl = this.helperservice.siteUrl;
    this.assetUrl = this.helperservice.assetUrl;

    // set client ip address
    const ipSub = this.userService.clientIp.subscribe((ip: string) => {
      this.clientIP = ip;
    });

    this.subscriptions.add(ipSub);

    // get the today weekday to calculate if today is open or not
    const today = new Date();
    this.current_weekday = today.getUTCDay() == 0 ? 6 : today.getUTCDay() - 1;

    // get the listing details
    this.listing_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (this.listing_slug != null) {
      this.spinnerService.show();

      const subsDetailsL = this.listingService.getListing(this.listing_slug);
      const subsFavoritesL = this.listingService.getFavorites();

      forkJoin([subsDetailsL, subsFavoritesL]).subscribe(
        (res: any) => {
  
          this.listing = res[0].data.listing;
          this.listing_categories = res[0].data.categories;
          this.listing_contact = res[0].data.contacts;
          this.listing_hours = res[0].data.hours;
          this.listing_menus = res[0].data.menus;
          this.favoriteListings = res[1].data;
  
          // set images path
          this.setImagesPath();
          this.isTodayOpen = this.calTodayOpen();

          // set galleryImages
          this.setGalleryImages();

          // set video urls
          this.setVideoUrls();

          // set coupon data
          this.setCoupon();

          // display edit or submit button
          if(this.helperservice.isUserLoggedIn() && (this.helperservice.currentUserInfo?.id == res[0].data.listing.user_id || this.helperservice.currentUserInfo?.id == res[0].data.listing.claimer_id) ){
            this.showEditButton = true;
            if(res[0].data.listing.status == 'draft') this.showSubmitButton = true;
          }

          this.spinnerService.hide();


          // get listing reviews
          this.setListingReviews();

          // check if the listing is favorite
          const fl = this.favoriteListings.find(l => l == this.listing.id);
          if(fl) this.listing.is_favorite = true;

          // update listing view 
          this.updateListingView(this.listing.id);
  
        },
        (error) => {
          this.spinnerService.hide();
          // TODO: redirect to 404 page
        }
      );
      
      

    }

  }

  updateListingView(id) {
    const subsUpdateView = this.listingService.updateView(id).subscribe(
      (res:any) => {
      },
      (res:any) => {
      }
    );
    
    this.subscriptions.add(subsUpdateView);
  }

  onClickListingFavorite(listing_id) {
    
    if(this.helperservice.currentUserInfo?.id){
      const subsUpdateFavorite = this.listingService.updateFavorite(listing_id).subscribe(
        (res:any) => {
          this.listing.is_favorite = !this.listing.is_favorite;
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

  onClickCommentEdit(comment_id:number) {
    this.isCommentEditClicked[comment_id] = true;
    this.isCommentDotsClicked[comment_id] = false;
  }

  onCloseCommentEdit(comment_id:number) {
    this.isCommentEditClicked[comment_id] = false;
  }

  onDeleteComment(comment_id:number) {

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the comment"?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscriptionDeleteComment = this.listingService.deleteComment(comment_id).subscribe(
          (res:any) => {

            this.setListingReviews();

          },
          (res:any) => {

          }
        );

        this.subscriptions.add(subscriptionDeleteComment);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);


  }

  onSubmitComment(review_id, comment, comment_id = '') {

    const data = {
      'listing_id': this.listing.id,
      'user_id': this.helperservice.currentUserInfo?.id,
      'review_id': review_id,
      'comment': comment,
      'comment_id': comment_id
    }

    const subscriptionSubmitComment = this.listingService.submitComment(data).subscribe(
      (res:any) => {
        if(res.status != 200){
          this.snackbar.openSnackBar(res.message, 'Close', 'warn');
        }
        else if(res.status == 200){
          // reset isCommentEditClicked to hide comment textarea
          this.isCommentEditClicked = [];

          // update review
          this.setListingReviews();
        }
      },
      (res:any) => {
        this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscriptionSubmitComment);


  }

  onKeydownCommentField(event, review_id = '', comment_id = '') {

    const comment = event.target.value;
    const textarea = event.target;
    const textarea_wrapper = textarea.closest(".field_module__1H6kT");
    const btn_comment_submit = textarea_wrapper.querySelector(".field_rightButton__1GGWz");

    // remove placeholder if textarea not empty
    if(comment != ''){
      textarea_wrapper.classList.add("active");
      btn_comment_submit.classList.add("active");
    }
    else{
      textarea_wrapper.classList.remove("active");
      btn_comment_submit.classList.remove("active");
    }

    // submit comment
    if (event.key === "Enter") {

      this.onSubmitComment(review_id, comment, comment_id);

      // reset everything
      textarea.value = '';
      textarea_wrapper.classList.remove("active");
      btn_comment_submit.classList.remove("active");
    }

  }

  onDeleteReview(review_id:number) {

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { message: 'Are you sure to delete the review"?' },
    });

    const dialogCloseSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscriptionDeleteReview = this.listingService.deleteReview(review_id).subscribe(
          (res:any) => {

            this.setListingReviews();

          },
          (res:any) => {

          }
        );

        this.subscriptions.add(subscriptionDeleteReview);
      }
    });

    this.subscriptions.add(dialogCloseSubscription);


  }

  onClickLikeReview(review_id, index) {
    const user_id = this.helperservice.currentUserInfo?.id ? this.helperservice.currentUserInfo?.id : this.clientIP;

    const data = {
      'review_id': review_id,
      'listing_id': this.listing.id,
      'user_id': user_id,
    }

    const subscriptionLikeReview = this.listingService.updateReviewLike(data).subscribe(
      (res:any) => {
        // update review array
        this.listing_reviews = res.data;
      },
      (res:any) => {

      }
    );

    this.subscriptions.add(subscriptionLikeReview);


  }

  getReviewAvatar(image) {
    if(image) {
      return this.helperservice.getImageUrl(image, 'users', 'thumb');
    }

    return this.assetUrl + '/img/avatar-default.png';
  }

  userCanEditReview(review_id:number):boolean {

    const review = this.listing_reviews.find(r => r.id == review_id);

    if(review.user_id == this.helperservice.currentUserInfo?.id) return true;

    return false;
  }

  userCanEditComment(comment:any):boolean {

    if(comment.user_id == this.helperservice.currentUserInfo?.id) return true;

    return false;
  }

  userHasLikedReview(review:any):boolean {

    if(review.like_list.length == 0) return false;

    const likes = review.like_list;

    const user_id = this.helperservice.currentUserInfo?.id ? this.helperservice.currentUserInfo.id : this.clientIP;

    const like = likes.find(l => l.user_id == user_id);

    if(like) return true;

    return false;
  }

  fnReviewComment(rating = 10):string {
    return this.review_comment[Math.trunc(rating)];
  }

  setListingReviews() {

    const subscriptionListingReviews = this.listingService.getReviews(this.listing.id).subscribe(
      (res:any) => {
        this.listing_reviews = res.data;

        // update average listing review
        if(this.listing_reviews.length > 0){
          let total_rating = this.listing_reviews.reduce( (accumulator, currentValue) => accumulator + currentValue.rating, 0);
          this.listing.avg_rating = total_rating / this.listing_reviews.length;
        }
        else{
          this.listing.avg_rating = 0;
        }

        this.doReviewCalculation();
      },
      (res:any) => {

      }
    );

    this.subscriptions.add(subscriptionListingReviews);
  }

  doReviewCalculation() {

    // check if current user has already posted review
    const user_id = this.helperservice.currentUserInfo?.id;
    const currentUserReview = this.listing_reviews.filter(review => review.user_id == user_id);

    if(currentUserReview.length > 0){
      this.currentUserReview = currentUserReview[0];
      this.currentUserCanReview = false;
    }
    else{
      this.currentUserCanReview = true;
    }

  }

  openReviewModal(review:any = ''): void {

    // check if the user is logged in
    this.userService.isAuthenticated().then(
      (res) => {
        this.dialogReview = this.dialog.open(ListingReviewModal, {
          width: '600px',
          data: { listing_id: this.listing.id, user_id: this.helperservice.currentUserInfo?.id, review: review}
        });

        this.dialogReview.afterClosed().subscribe((result) => {
          // update review data
          this.setListingReviews();

          // hide tooltip edit/delete
          if(review){
            this.currentUserReview = review;
            this.isReviewDotsClicked[review.id] = false;
          }
        });

        this.subscriptions.add(this.dialogReview);

      },
      (res) => {
        this.dialog.open(LoginModal, {
          width: '400px'
        });
      }
    );

  }

  onChangeTab(tab:string = 'home') {
    this.current_tab = tab;
  }

  openCouponModal(): void {
    this.dialog.open(CouponModal, {
      width: '600px',
      data: { coupon: this.listing_coupon}
    });
  }

  setCoupon() {
    
    // first check if coupon expiry date exists and greated than today
    if(!this.listing.coupon_expiry_date){
      this.listing_coupon.valid = false;
      return;
    }

    const expiry_date = moment(this.listing.coupon_expiry_date).format("YYYY-MM-DD HH:mm:ss");
    const currentTime = this.helperservice.dateTimeNow();

    if(currentTime > expiry_date) {
      this.listing_coupon.valid = false;
      return;
    }

    // coupon is available
    this.listing_coupon.valid = true;
    this.listing_coupon.title = this.listing.coupon_title;
    this.listing_coupon.description = this.listing.coupon_description;
    this.listing_coupon.image = this.listing.coupon_image;
    this.listing_coupon.code = this.listing.coupon_code;
    this.listing_coupon.popup_desc = this.listing.coupon_popup_desc;
    this.listing_coupon.link = this.listing.coupon_link;
    this.listing_coupon.expire = expiry_date;

  }

  openVideoModal(index:number = 0): void {
    this.dialog.open(ListingVideoModal, {
      width: '800px',
      data: { index: index, videos: this.listing_videos},
      panelClass: 'listing-gallery-panel',
      backdropClass: 'listing-gallery-backdrop',
    });
  }

  setVideoUrls() {
    if(this.listing.video_urls != ''){
      const videos = JSON.parse(this.listing.video_urls);
      for (const item of videos) {
        const url_arr = item.split('?v=');

        let video_id = '';
        if(url_arr.length == 2){
          video_id = url_arr[1].replace('/', '');
        }

        const obj = {
          url: item,
          image: 'https://img.youtube.com/vi/'+video_id+'/hqdefault.jpg'
        }

        this.listing_videos.push(obj);
      }
    }
  }

  openGalleryModal(index:number = 0): void {
    this.dialog.open(ListingGalleryModal, {
      width: '100vw',
      data: { index: index, galleries: this.listing.galleries},
      panelClass: 'listing-gallery-panel',
      backdropClass: 'listing-gallery-backdrop',
    });
  }

  setGalleryImages() {
    if(this.listing.galleries != ''){
      const galleries = JSON.parse(this.listing.galleries);
      for (const item of galleries) {
        const obj = {
          small: this.helperservice.getImageUrl(item, 'listing', 'thumb'),
          medium: this.helperservice.getImageUrl(item, 'listing', 'medium'),
          big: this.helperservice.getImageUrl(item, 'listing')
        }

        this.listing_galleries.push(obj);
      }
    }
  }

  calTodayOpen() {
    const d = new Date(); // current time
    const hours = d.getUTCHours();
    const mins = d.getUTCMinutes();
    const listing_time = this.listing_hours[this.current_weekday];

    if (listing_time?.is_open != 1) return false;

    const first_start_hour = listing_time.first_hour_start.split(':')[0];
    const first_start_minute = listing_time.first_hour_start.split(':')[1];
    const first_end_hour = listing_time.first_hour_end.split(':')[0];
    const first_end_minute = listing_time.first_hour_end.split(':')[1];

    if( ( first_start_hour < hours || (first_start_hour == hours && first_start_minute <= mins) ) &&
      (hours < first_end_hour || hours == first_end_hour && mins <= first_end_minute) ){
        return true;
    }

    if(listing_time.second_hour_start && listing_time.second_hour_end){
      const start_hour = listing_time.second_hour_start.split(':')[0];
      const start_minute = listing_time.second_hour_start.split(':')[1];
      const end_hour = listing_time.second_hour_end.split(':')[0];
      const end_minute = listing_time.second_hour_end.split(':')[1];

      if( ( start_hour < hours || (start_hour == hours && start_minute <= mins) ) &&
        (hours < end_hour || hours == end_hour && mins <= end_minute) ){

          return true;
      }

    }

    return false;

  }

  setImagesPath() {
    this.cover_img = this.helperservice.getImageUrl(this.listing.cover_img, 'listing', 'large');
    this.logo = this.helperservice.getImageUrl(this.listing.logo, 'listing', 'thumb');
  }


  onSubmitListing() {
    const listing_id = this.listing.id;
    this.spinnerService.show();
    const subscriptionPublishListing = this.listingService.publishListing({id: listing_id}).subscribe(
      (res:any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message);

        // hide sumit button
        this.showSubmitButton = false;
      },
      (res:any) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscriptionPublishListing);

  }

  openContactOwnerModal(): void {

    if(this.listing_owner && Object.keys(this.listing_owner).length == 0){
      this.spinnerService.show();

      const subscriptionListingOwner = this.userService.getDetailsByID(this.listing.user_id).subscribe(
        (res:any) => {

          this.spinnerService.hide();

          this.listing_owner = res.data.data;
          this.dialog.open(ContactOwnerModal, {
            width: '550px',
            data: { id: this.listing_owner.id, username: this.listing_owner.username}
          });
        },
        (res:any) => {
          this.spinnerService.hide();
        }
      );

      this.subscriptions.add(subscriptionListingOwner);
    }
    else{
      this.dialog.open(ContactOwnerModal, {
        width: '550px',
        data: { id: this.listing_owner.id, username: this.listing_owner.username}
      });
    }

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}

