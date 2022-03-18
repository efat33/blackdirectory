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
  selector: 'app-new-forum',
  templateUrl: './forums-new.component.html',
  styleUrls: ['./forums-new.component.scss'],
})
export class NewForumComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  forumCategories = [];

  editForumId: number = null;
  forumForm: FormGroup;
  showError = false;
  errorMessage = '';

  ckConfig = {
    placeholder: 'Content',
  };

  ckEditor = DocumentEditor;

  // convenience getter for easy access to form fields
  get f() {
    return this.forumForm.controls;
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

    this.getForumCategories();

    const forumId = this.route.snapshot.paramMap.get('forum_id');
    
    if (forumId != null) {
      this.editForumId = parseInt(forumId);

      this.spinnerService.show();
      this.forumService.getSingleForum(this.editForumId).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          const forum = result.data;

          if (forum) {
            this.prepareForm(forum);
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

  getForumCategories() {
    this.spinnerService.show();
    const getSectorsSubscription = this.forumService.getCategories().subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.forumCategories = result.data;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getSectorsSubscription);
  }

  initializeForm() {
    this.forumForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),

      meta_title: new FormControl(''),
      meta_keywords: new FormControl(''),
      meta_desc: new FormControl(''),
    });
  }

  prepareForm(forum: any) {
    if (!forum) {
      return;
    }

    this.forumForm.patchValue({
      title: forum.title,
      description: forum.description,
      category_id: forum.category_id,
      status: forum.status,
      meta_title: forum.meta_title,
      meta_keywords: forum.meta_keywords,
      meta_desc: forum.meta_desc,
    });
  }


  onSubmit() {
    if (this.editForumId == null) {
      this.createForum();
    } else {
      this.updateForum();
    }
  }

  createForum() {
    const formValues = this.forumForm.value;

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

  updateForum() {
    const formValues = this.forumForm.value;

    this.spinnerService.show();
    const updateForumSubscription = this.forumService.updateForum(this.editForumId, formValues).subscribe(
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

    this.subscriptions.add(updateForumSubscription);
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
