import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HelperService } from 'src/app/shared/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomUploadAdapter } from 'src/app/shared/ckeditorImageUploadAdapter';
import { NewsService } from 'src/app/news/news.service';
import { TravelService } from 'src/app/travels/travels.service';

@Component({
  selector: 'app-new-travel',
  templateUrl: './new-travel.component.html',
  styleUrls: ['./new-travel.component.scss'],
})
export class NewTravelComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  featuredImageSrc: string;

  editTravelId: number = null;
  travelForm: FormGroup;
  showError = false;
  errorMessage = '';
  progressFeaturedImage: number = 0;

  formCustomvalidation = {
    featuredImage: {
      validated: true,
      message: '',
    },
  };

  ckConfig = {
    placeholder: 'Content',
  };

  ckEditor = DocumentEditor;

  // convenience getter for easy access to form fields
  get f() {
    return this.travelForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private travelService: TravelService,
    private uploadService: UploadService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private cdk: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();

    const travelId = this.route.snapshot.paramMap.get('travel_id');
    
    if (travelId != null) {
      this.editTravelId = parseInt(travelId);

      this.spinnerService.show();
      this.travelService.getSingleTravel(this.editTravelId).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          const travel = result.data[0];
          
          if (travel) {
            this.prepareForm(travel);

            if (travel.featured_image) {
              this.featuredImageSrc = this.helperService.getImageUrl(travel.featured_image, 'travels', 'thumb');
            }
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );
    }
  }

  ngAfterViewInit() {}

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());

    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader, this.helperService.apiUrl, 'travels', 'upload/image-travel-ckeditor');
    };
  }

  initializeForm() {
    this.travelForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      featured_image: new FormControl('', Validators.required),
    });
  }

  prepareForm(travel: any) {
    if (!travel) {
      return;
    }

    this.travelForm.patchValue({
      title: travel.title,
      content: travel.content,
      featured_image: travel.featured_image,
    });
  }

  onAttachmentChange(event) {
    // reset validation
    this.formCustomvalidation.featuredImage.validated = true;
    this.formCustomvalidation.featuredImage.message = '';

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.featuredImage.validated = false;
        this.formCustomvalidation.featuredImage.message = res.message;
        return;
      }

      this.featuredImageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'travel').subscribe((result: HttpEvent<any>) => {
        switch (result.type) {
          case HttpEventType.UploadProgress:
            this.progressFeaturedImage = Math.round((result.loaded / result.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (result.body.data.fileValidationError) {
              this.formCustomvalidation.featuredImage.validated = false;
              this.formCustomvalidation.featuredImage.message = result.body.data.fileValidationError;
            } else {
              this.travelForm.get('featured_image').patchValue(result.body.data.filename);
            }

            // hide progress bar
            setTimeout(() => {
              this.progressFeaturedImage = 0;
            }, 1500);
        }
      });
    }
  }

  onSubmit() {
    if (this.editTravelId == null) {
      this.createTravel();
    } else {
      this.updateTravel();
    }
  }

  createTravel() {
    const formValues = this.travelForm.getRawValue();

    this.spinnerService.show();
    const newNewsSubscription = this.travelService.addTravel(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/admin/all-travels']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newNewsSubscription);
  }

  updateTravel() {
    const formValues = this.travelForm.value;

    this.spinnerService.show();
    const updateNewsSubscription = this.travelService.updateTravel(this.editTravelId, formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/admin/all-travels']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(updateNewsSubscription);
  }

  formatSalarySliderLabel(value: number) {
    return Math.round(value / 1000) + 'k';
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
