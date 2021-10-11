import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
import { DealsService } from 'src/app/deals/deals.service';

@Component({
  selector: 'app-new-deal',
  templateUrl: './new-deal.component.html',
  styleUrls: ['./new-deal.component.scss'],
})
export class NewDealComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  dealers = [];

  imageSrc: string;

  editDealId: number = null;
  dealForm: FormGroup;
  showError = false;
  errorMessage = '';
  progressFeaturedImage: number = 0;

  formCustomvalidation = {
    image: {
      validated: true,
      message: '',
    },
  };

  ckConfig = {
    placeholder: 'Description',
  };

  ckEditor = DocumentEditor;

  // convenience getter for easy access to form fields
  get f() {
    return this.dealForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealsService: DealsService,
    private uploadService: UploadService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getDealers();

    const dealId = this.route.snapshot.paramMap.get('deal_id');
    if (dealId != null) {
      this.editDealId = parseInt(dealId);

      this.spinnerService.show();
      this.dealsService.getDeal(this.editDealId).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          const deal = result.data[0];

          if (deal) {
            this.prepareForm(deal);

            if (deal.image) {
              this.imageSrc = this.helperService.getImageUrl(deal.image, 'deal', 'thumb');
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
      return new CustomUploadAdapter(loader, this.helperService.apiUrl, 'deal', 'upload/image-deal-ckeditor');
    };
  }

  initializeForm() {
    this.dealForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      short_description: new FormControl('', Validators.required),
      price_description: new FormControl('', Validators.required),
      dealer_id: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      deal_link: new FormControl('', Validators.required),
      free_shipping: new FormControl(''),
      discount_code: new FormControl(''),
      expiry_date: new FormControl(''),
    });
  }

  prepareForm(deal: any) {
    if (!deal) {
      return;
    }

    this.dealForm.patchValue({
      title: deal.title,
      description: deal.description,
      short_description: deal.short_description,
      price_description: deal.price_description,
      dealer_id: deal.dealer_id,
      image: deal.image,
      deal_link: deal.deal_link,
      free_shipping: deal.free_shipping,
      discount_code: deal.discount_code,
      expiry_date: deal.expiry_date,
    });
  }

  getDealers() {
    this.spinnerService.show();
    const getSectorsSubscription = this.dealsService.getDealers().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.dealers = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getSectorsSubscription);
  }

  onAttachmentChange(event) {
    // reset validation
    this.formCustomvalidation.image.validated = true;
    this.formCustomvalidation.image.message = '';

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      // do validation
      const res = this.helperService.imageValidation(file);
      if (!res.validated) {
        this.formCustomvalidation.image.validated = false;
        this.formCustomvalidation.image.message = res.message;
        return;
      }

      this.imageSrc = URL.createObjectURL(file);

      // send image to the server
      const fd = new FormData();
      fd.append('image', file, file.name);
      fd.append('resize', 'yes');

      this.uploadService.uploadImage(fd, 'deal').subscribe((result: HttpEvent<any>) => {
        switch (result.type) {
          case HttpEventType.UploadProgress:
            this.progressFeaturedImage = Math.round((result.loaded / result.total) * 100);
            break;
          case HttpEventType.Response:
            // check for validation
            if (result.body.data.fileValidationError) {
              this.formCustomvalidation.image.validated = false;
              this.formCustomvalidation.image.message = result.body.data.fileValidationError;
            } else {
              this.dealForm.get('image').patchValue(result.body.data.filename);
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
    if (this.editDealId == null) {
      this.createDeal();
    } else {
      this.updateDeal();
    }
  }

  createDeal() {
    const formValues = this.dealForm.value;

    this.spinnerService.show();
    const newDealSubscription = this.dealsService.addDeal(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/admin/deals-all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newDealSubscription);
  }

  updateDeal() {
    const formValues = this.dealForm.value;

    this.spinnerService.show();
    const updateDealSubscription = this.dealsService.updateDeal(this.editDealId, formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/admin/deals-all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(updateDealSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
