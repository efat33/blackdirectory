import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadService } from 'src/app/shared/services/upload.service';
import { HelperService } from 'src/app/shared/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomUploadAdapter } from 'src/app/shared/ckeditorImageUploadAdapter';
import { MobilesService } from 'src/app/mobiles/mobiles.service';

@Component({
  selector: 'app-new-mobile',
  templateUrl: './new-mobile.component.html',
  styleUrls: ['./new-mobile.component.scss'],
})
export class NewMobileComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  mobilesProviders = [];

  featuredImageSrc: string;

  editMobilesId: number = null;
  mobilesForm: FormGroup;
  showError = false;
  errorMessage = '';

  ckConfig = {
    placeholder: 'Description',
    toolbar: ['heading', '|', 'bold', 'italic', 'link'],
  };

  ckEditor = DocumentEditor;

  // convenience getter for easy access to form fields
  get f() {
    return this.mobilesForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public mobilesService: MobilesService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getMobilesProviders();

    const mobileId = this.route.snapshot.paramMap.get('mobile_id');
    if (mobileId != null) {
      this.editMobilesId = parseInt(mobileId);

      const getMobileSubs = this.mobilesService.getMobile(this.editMobilesId);
      const getTopMobilesSub = this.mobilesService.getTopMobiles();

      this.spinnerService.show();
      forkJoin([getMobileSubs, getTopMobilesSub]).subscribe(
        (results: any) => {
          this.spinnerService.hide();

          const mobile = results[0].data[0];
          const topMobiles = results[1].data;

          if (mobile) {
            const isTopPick = topMobiles.find((topMobile: any) => topMobile.id === mobile.id);
            mobile.isTopPick = !!isTopPick;

            this.prepareForm(mobile);
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
      return new CustomUploadAdapter(loader, this.helperService.apiUrl, 'mobiles', 'upload/image-mobiles-ckeditor');
    };
  }

  initializeForm() {
    this.mobilesForm = new FormGroup({
      description: new FormControl('', Validators.required),
      link: new FormControl('', Validators.required),
      provider_id: new FormControl('', Validators.required),
      cost: new FormControl('', Validators.required),
      data: new FormControl('', Validators.required),
      minutes: new FormControl('', Validators.required),
      texts: new FormControl('', Validators.required),
      contract_length: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      top_pick: new FormControl(0),
    });
  }

  prepareForm(mobile: any) {
    if (!mobile) {
      return;
    }

    this.mobilesForm.patchValue({
      description: mobile.description,
      link: mobile.link,
      provider_id: mobile.provider_id,
      cost: mobile.cost,
      data: this.getUnlimitedOrValue(mobile.data),
      minutes: this.getUnlimitedOrValue(mobile.minutes),
      texts: this.getUnlimitedOrValue(mobile.texts),
      contract_length: mobile.contract_length,
      category: mobile.category,
      top_pick: mobile.isTopPick,
    });

    if (this.isUnlimited('data')) {
      this.mobilesForm.get('data').disable();
    }

    if (this.isUnlimited('minutes')) {
      this.mobilesForm.get('minutes').disable();
    }

    if (this.isUnlimited('texts')) {
      this.mobilesForm.get('texts').disable();
    }
  }

  getUnlimitedOrValue(value: number) {
    if (value === this.mobilesService.unlimitedNumber) {
      return 'Unlimited';
    }

    return value;
  }

  isUnlimited(formControlName: string) {
    const value = this.mobilesForm.get(formControlName).value;

    return value === 'Unlimited';
  }

  getMobilesProviders() {
    this.spinnerService.show();
    const getSectorsSubscription = this.mobilesService.getMobileProviders().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.mobilesProviders = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getSectorsSubscription);
  }

  onSubmit() {
    if (this.editMobilesId == null) {
      this.createMobiles();
    } else {
      this.updateMobiles();
    }
  }

  createMobiles() {
    const formValues = this.mobilesForm.getRawValue();

    const keys = ['data', 'minutes', 'texts'];
    for (const key in formValues) {
      if (keys.includes(key) && formValues[key] === 'Unlimited') {
        formValues[key] = this.mobilesService.unlimitedNumber;
      }
    }

    this.spinnerService.show();
    const newMobilesSubscription = this.mobilesService.addMobile(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.router.navigate(['/admin/mobiles-all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newMobilesSubscription);
  }

  updateMobiles() {
    const formValues = this.mobilesForm.getRawValue();

    const keys = ['data', 'minutes', 'texts'];
    for (const key in formValues) {
      if (keys.includes(key) && formValues[key] === 'Unlimited') {
        formValues[key] = this.mobilesService.unlimitedNumber;
      }
    }

    this.spinnerService.show();
    const updateMobilesSubscription = this.mobilesService.updateMobile(this.editMobilesId, formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/admin/mobiles-all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(updateMobilesSubscription);
  }

  onToggleChange(checked: boolean, formControlName: string) {
    if (checked) {
      this.mobilesForm.get(formControlName).setValue('Unlimited');
      this.mobilesForm.get(formControlName).disable();
    } else {
      this.mobilesForm.get(formControlName).setValue('');
      this.mobilesForm.get(formControlName).enable();
    }
  }

  numericOnly(event: any): boolean {
    const patt = /^([0-9.])$/;
    const result = patt.test(event.key);

    return result;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
