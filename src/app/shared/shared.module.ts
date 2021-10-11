import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// import all component
import { HeaderComponent } from '.././header/header.component';
import { HeaderCartComponent } from 'src/app/shop/header-cart/header-cart.component';
import { FooterComponent } from '.././footer/footer.component';
import { DashboardSidebarComponent } from '../dashboard/sidebar/sidebar.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { PaginationComponent } from './pagination/pagination.component';

// import all modals
import { RegistrationModal } from '../modals/user/registration/registration-modal';
import { LoginModal } from '../modals/user/login/login-modal';
import { CandidateEducationModal } from '../modals/user/candidate-education/candidate-education-modal';
import { CandidateExperienceModal } from '../modals/user/candidate-experience/candidate-experience-modal';
import { CandidatePortfolioModal } from '../modals/user/candidate-portfolio/candidate-portfolio-modal';
import { ConfirmationDialog } from '../modals/confirmation-dialog/confirmation-dialog';
import { JobApplyInternalModal } from '../modals/job/jobapply-internal/jobapply-internal-modal';
import { JobApplyEmailModal } from '../modals/job/jobapply-email/jobapply-email-modal';
import { ContactEmployerModal } from '../modals/job/contact-employer/contact-employer-modal';
import { ListingSearchCatModal } from '../modals/listing/search/category/listing-search-cat-modal';
import { ListingSearchPriceModal } from '../modals/listing/search/price/listing-search-price-modal';
import { ListingSearchSortModal } from '../modals/listing/search/sortby/listing-search-sortby-modal';
import { EventSearchCatModal } from '../modals/events/search/category/event-search-cat-modal';
import { EventSearchOrganizersModal } from '../modals/events/search/organizers/event-search-organizers-modal';
import { EventSearchVenueModal } from '../modals/events/search/venues/event-search-venues-modal';
import { EventSearchCityModal } from '../modals/events/search/cities/event-search-cities-modal';
import { NewOrganizerModal } from '../modals/events/new/new-organizer/new-organizer-modal';
import { EventTicketModal } from '../modals/events/new/event-ticket/event-ticket-modal';
import { EventRsvpModal } from '../modals/events/new/event-rsvp/event-rsvp-modal';
import { ContactOwnerModal } from '../modals/listing/details/contact-owner/contact-owner-modal';
import { RsvpApplyModal } from '../modals/events/details/rsvp-apply/rsvp-apply-modal';
import { ProductQuickViewModal } from '../modals/product-quick-view/product-quick-view.component';
import { InformationDialogComponent } from '../modals/information-dialog/information-dialog';

// import all modules
import { SwiperModule } from 'swiper/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { imageSrc, encodeURL, pluralPipe, rsvpTimeLeft, excerpt, decimalPipe, fileSrc, SafeHtmlPipe } from './custom-pipes';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { MatSliderModule } from '@angular/material/slider';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TimeUntilPipe } from './pipes/time-until.pipe';
import { NouisliderModule } from 'ng2-nouislider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClickOutsideModule } from 'ng-click-outside';
import { SendMessageModalComponent } from '../modals/job/send-message/send-message-modal';
import { AdminSidebarComponent } from '../admin/sidebar/sidebar.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { ShareModule } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { RatingModule } from 'ng-starrating';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MatTreeModule } from '@angular/material/tree';
import { ListingGalleryModal } from '../modals/listing/details/gallery/listing-gallery-modal';
import { ListingVideoModal } from '../modals/listing/details/video/listing-video-modal';
import { CouponModal } from '../modals/listing/details/coupon/coupon-modal';
import { ListingReviewModal } from '../modals/listing/details/review/listing-review-modal';
import { ImageInputComponent } from './components/image-input/image-input.component';
import { DropFileDirective } from './components/image-input/drop-file.directive';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CountdownModule } from 'ngx-countdown';
import { MatCardModule } from '@angular/material/card';
import { EventSearchDateModal } from '../modals/events/search/date/event-search-date-modal';
import { ListingClaimModal } from '../modals/listing/details/claim/listing-claim-modal';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ForgotPasswordModal } from '../modals/user/forgot-password/forgot-password-modal';
import { ResetPasswordModal } from '../modals/user/reset-password/reset-password-modal';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProductPriceComponent } from './components/product-price/product-price.component';
import { BdyImagePipe } from './pipes/bdy-image.pipe';
import { SendEmailModalComponent } from '../modals/send-email/send-email-modal';
import { EmailJobModalComponent } from '../modals/job/email-job/email-job-modal';
import { ClipboardModule } from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    HeaderComponent,
    HeaderCartComponent,
    ProductPreviewComponent,
    FooterComponent,
    RegistrationModal,
    LoginModal,
    CandidateEducationModal,
    ConfirmationDialog,
    CandidateExperienceModal,
    CandidatePortfolioModal,
    DashboardSidebarComponent,
    JobApplyInternalModal,
    JobApplyEmailModal,
    ContactEmployerModal,
    ContactOwnerModal,
    ListingSearchCatModal,
    ListingSearchPriceModal,
    ListingSearchSortModal,
    EventSearchCatModal,
    EventSearchOrganizersModal,
    EventSearchVenueModal,
    EventSearchCityModal,
    NewOrganizerModal,
    EventTicketModal,
    EventRsvpModal,
    ProductQuickViewModal,
    imageSrc,
    fileSrc,
    TimeAgoPipe,
    TimeUntilPipe,
    encodeURL,
    SendMessageModalComponent,
    AdminSidebarComponent,
    pluralPipe,
    decimalPipe,
    SafeHtmlPipe,
    excerpt,
    rsvpTimeLeft,
    ListingGalleryModal,
    ListingVideoModal,
    CouponModal,
    ListingReviewModal,
    ImageInputComponent,
    DropFileDirective,
    RsvpApplyModal,
    PaginationComponent,
    EventSearchDateModal,
    ListingClaimModal,
    ForgotPasswordModal,
    ResetPasswordModal,
    OrderDetailsComponent,
    OrderListComponent,
    ProductPriceComponent,
    BdyImagePipe,
    InformationDialogComponent,
    SendEmailModalComponent,
    EmailJobModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    SwiperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DragDropModule,
    MatExpansionModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatTreeModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressBarModule,
    NgxStickySidebarModule,
    RatingModule,
    MatSliderModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatTabsModule,
    NouisliderModule,
    MatPaginatorModule,
    ClickOutsideModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    ShareModule,
    ShareButtonsModule,
    ShareIconsModule,
    NgxGalleryModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CountdownModule,
    MatCardModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatTreeModule,
    MatListModule,
    ClipboardModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderComponent,
    HeaderCartComponent,
    ProductPreviewComponent,
    OrderDetailsComponent,
    OrderListComponent,
    ProductPriceComponent,
    FooterComponent,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    SwiperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DragDropModule,
    DashboardSidebarComponent,
    MatExpansionModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatTreeModule,
    FlexLayoutModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatTabsModule,
    RatingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressBarModule,
    imageSrc,
    fileSrc,
    encodeURL,
    NgxStickySidebarModule,
    MatSliderModule,
    TimeAgoPipe,
    TimeUntilPipe,
    BdyImagePipe,
    NouisliderModule,
    MatPaginatorModule,
    ClickOutsideModule,
    AdminSidebarComponent,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    ShareModule,
    ShareButtonsModule,
    ShareIconsModule,
    pluralPipe,
    decimalPipe,
    SafeHtmlPipe,
    excerpt,
    ImageInputComponent,
    DropFileDirective,
    rsvpTimeLeft,
    NgxGalleryModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CountdownModule,
    MatCardModule,
    PaginationComponent,
    HttpClientModule,
    HttpClientJsonpModule,
    MatTreeModule,
    MatListModule,
    InformationDialogComponent,
    SendEmailModalComponent,
    EmailJobModalComponent,
    ClipboardModule,
  ],
  entryComponents: [
    RegistrationModal,
    LoginModal,
    CandidateEducationModal,
    ConfirmationDialog,
    CandidateExperienceModal,
    CandidatePortfolioModal,
    JobApplyInternalModal,
    JobApplyEmailModal,
    ContactEmployerModal,
    ContactOwnerModal,
    ListingSearchCatModal,
    ListingSearchPriceModal,
    ListingSearchSortModal,
    EventSearchCatModal,
    EventSearchOrganizersModal,
    EventSearchVenueModal,
    EventSearchCityModal,
    NewOrganizerModal,
    EventTicketModal,
    EventRsvpModal,
    SendMessageModalComponent,
    ListingGalleryModal,
    ListingVideoModal,
    CouponModal,
    ListingReviewModal,
    RsvpApplyModal,
    EventSearchDateModal,
    ListingClaimModal,
    ForgotPasswordModal,
    ResetPasswordModal,
  ],
})
export class SharedModule {}
