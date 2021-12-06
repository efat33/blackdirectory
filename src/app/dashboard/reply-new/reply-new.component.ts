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
import { ForumService } from 'src/app/forums/forum.service';

@Component({
  selector: 'app-new-reply',
  templateUrl: './reply-new.component.html',
  styleUrls: ['./reply-new.component.scss'],
})
export class NewReplyComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();


  editReplyId: number = null;
  replyForm: FormGroup;
  showError = false;
  errorMessage = '';

  ckConfig = {
    placeholder: 'Content',
  };

  ckEditor = DocumentEditor;

  // convenience getter for easy access to form fields
  get f() {
    return this.replyForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private forumService: ForumService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private cdk: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();

    const replyId = this.route.snapshot.paramMap.get('reply_id');

    // if it's new reply page, then redirect to home page
    if(!replyId) this.router.navigate(['home']);
    
    if (replyId != null) {
      this.editReplyId = parseInt(replyId);

      this.spinnerService.show();
      this.forumService.getSingleReply(this.editReplyId).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          const reply = result.data;

          if (reply) {
            this.prepareForm(reply);
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

  }

  initializeForm() {
    this.replyForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }

  prepareForm(reply: any) {
    if (!reply) {
      return;
    }

    this.replyForm.patchValue({
      content: reply.content
    });
  }


  onSubmit() {
    if (this.editReplyId == null) {
      this.createReply();
    } else {
      this.updateReply();
    }
  }

  createReply() {
    const formValues = this.replyForm.value;

    this.spinnerService.show();
    const newForumSubscription = this.forumService.addForum(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);

        this.router.navigate(['/dashboard/forums/all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newForumSubscription);
  }

  updateReply() {
    const formValues = this.replyForm.value;

    this.spinnerService.show();
    const updateForumSubscription = this.forumService.updateReply(this.editReplyId, formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);
        
        this.router.navigate(['/dashboard/replies/all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(updateForumSubscription);
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
