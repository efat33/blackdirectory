import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { PagesService } from 'src/app/pages/pages.service';
import * as DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'add-faq-modal',
  templateUrl: 'add-faq-modal.html',
  styleUrls: ['./add-faq-modal.scss'],
})
export class AddFaqModalComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  faqForm: FormGroup;
  faq: any = {};

  ckEditor = DocumentEditor;
  ckConfig = {
    placeholder: 'Job Description',
    height: 200,
    toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList'],
  };

  constructor(
    private dialogRef: MatDialogRef<AddFaqModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private pagesService: PagesService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService
  ) {
    this.faq = this.data?.faq || {};
  }

  ngOnInit(): void {
    this.faqForm = new FormGroup({
      question: new FormControl(this.faq.question || '', Validators.required),
      answer: new FormControl(this.faq.answer || '', Validators.required),
      faq_order: new FormControl(this.faq.faq_order || 1, Validators.required),
    });
  }

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
  }

  onSubmit() {
    if (this.faq.id) {
      this.editFaq();
    } else {
      this.addFaq();
    }
  }

  addFaq() {
    this.spinnerService.show();
    const subscription = this.pagesService.addFaq(this.faqForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('FAQ added');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  editFaq() {
    this.spinnerService.show();
    const subscription = this.pagesService.updateFaq(this.faq.id, this.faqForm.value).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar('FAQ updated');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
