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
import { FinanceService } from 'src/app/finance/finance.service';

@Component({
  selector: 'app-new-finance',
  templateUrl: './new-finance.component.html',
  styleUrls: ['./new-finance.component.scss'],
})
export class NewFinanceComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  featuredImageSrc: string;

  editFinanceId: number = null;
  financeForm: FormGroup;
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
    return this.financeForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private financeService: FinanceService,
    private uploadService: UploadService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private cdk: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();

    const financeId = this.route.snapshot.paramMap.get('finance_id');
    
    if (financeId != null) {
      this.editFinanceId = parseInt(financeId);

      this.spinnerService.show();
      this.financeService.getSingleFinance(this.editFinanceId).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          const finance = result.data[0];
          
          if (finance) {
            this.prepareForm(finance);

            if (finance.featured_image) {
              this.featuredImageSrc = this.helperService.getImageUrl(finance.featured_image, 'finance', 'thumb');
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
      return new CustomUploadAdapter(loader, this.helperService.apiUrl, 'finance', 'upload/image-finance-ckeditor');
    };
  }

  initializeForm() {
    this.financeForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      featured_image: new FormControl('', Validators.required),

      meta_title: new FormControl(''),
      meta_keywords: new FormControl(''),
      meta_desc: new FormControl(''),
    });
  }

  prepareForm(finance: any) {
    if (!finance) {
      return;
    }

    this.financeForm.patchValue({
      title: finance.title,
      content: finance.content,
      featured_image: finance.featured_image,

      meta_title: finance.meta_title,
      meta_keywords: finance.meta_keywords,
      meta_desc: finance.meta_desc,
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

      this.uploadService.uploadImage(fd, 'finance').subscribe((result: HttpEvent<any>) => {
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
              this.financeForm.get('featured_image').patchValue(result.body.data.filename);
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
    if (this.editFinanceId == null) {
      this.createFinance();
    } else {
      this.updateFinance();
    }
  }

  createFinance() {
    const formValues = this.financeForm.getRawValue();

    this.spinnerService.show();
    const newNewsSubscription = this.financeService.addFinance(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/admin/all-finance']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newNewsSubscription);
  }

  updateFinance() {
    const formValues = this.financeForm.value;

    this.spinnerService.show();
    const updateNewsSubscription = this.financeService.updateFinance(this.editFinanceId, formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/admin/all-finance']);
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
