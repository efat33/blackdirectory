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
import { PagesService } from 'src/app/pages/pages.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss'],
})
export class NewPageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  editPageSlug: string = null;
  pageForm: FormGroup;
  showError = false;
  errorMessage = '';

  ckConfig = {
    placeholder: 'Content',
  };

  ckEditor = DocumentEditor;

  // convenience getter for easy access to form fields
  get f() {
    return this.pageForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public pagesService: PagesService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    this.initializeForm();

    const pageSlug = this.route.snapshot.paramMap.get('page_slug');
    if (pageSlug != null) {
      this.editPageSlug = pageSlug;

      this.spinnerService.show();
      const subscription = this.pagesService.getPage(this.editPageSlug).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          this.prepareForm(result.data[0]);
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );

      this.subscriptions.add(subscription);
    }
  }

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());

    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader, this.helperService.apiUrl, 'pages', 'upload/image-pages-ckeditor');
    };
  }

  initializeForm() {
    this.pageForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      meta_title: new FormControl(''),
      meta_keywords: new FormControl(''),
      meta_desc: new FormControl(''),
    });
  }

  prepareForm(page: any) {
    if (!page) {
      return;
    }

    this.pageForm.patchValue({
      title: page.title,
      content: page.content,
      meta_title: page.meta_title,
      meta_keywords: page.meta_keywords,
      meta_desc: page.meta_desc,
    });
  }

  onSubmit() {
    if (this.editPageSlug == null) {
      this.createPage();
    } else {
      this.updatePage();
    }
  }

  createPage() {
    this.spinnerService.show();
    const newPagesSubscription = this.pagesService.addPage(this.pageForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.router.navigate(['/admin/page-all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newPagesSubscription);
  }

  updatePage() {
    this.spinnerService.show();
    const updatePagesSubscription = this.pagesService.updatePage(this.editPageSlug, this.pageForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.router.navigate(['/admin/page-all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(updatePagesSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
