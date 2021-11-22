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
import { ForumService } from 'src/app/forums/forum.service';

@Component({
  selector: 'app-new-topic',
  templateUrl: './topics-new.component.html',
  styleUrls: ['./topics-new.component.scss'],
})
export class NewTopicComponent implements OnInit, AfterViewInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  forums = [];
  forum_id:number = null;
  editTopiId: number = null;
  topicForm: FormGroup;
  showError = false;
  errorMessage = '';

  queryParams = {
    keyword: '',
    limit: -1,
    page: 1,
  };

  ckConfig = {
    placeholder: 'Content',
  };

  ckEditor = DocumentEditor;

  // convenience getter for easy access to form fields
  get f() {
    return this.topicForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService,
    private helperService: HelperService,
    private spinnerService: SpinnerService,
    private snackbar: SnackBarService,
    private cdk: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const topicId = this.route.snapshot.paramMap.get('topic_id');
    const forumId = this.route.snapshot.queryParamMap.get('forum_id');
    if(forumId) this.forum_id = parseInt(forumId);

    this.initializeForm();
    this.getForums();

    
    
    if (topicId != null) {
      this.editTopiId = parseInt(topicId);

      this.spinnerService.show();
      this.forumService.getSingleTopic(this.editTopiId).subscribe(
        (result: any) => {
          this.spinnerService.hide();

          const topic = result.data;
          
          if (topic) {
            this.prepareForm(topic);
          }
        },
        (error) => {
          this.spinnerService.hide();
          this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
        }
      );
    }
  }

  getForums() {
    this.spinnerService.show();
    const getForumsSubscription = this.forumService.getForums(this.queryParams).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.forums = result.data.data.forums;
      },
      (error) => {
        this.spinnerService.hide();
        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(getForumsSubscription);
  }

  ngAfterViewInit() {}

  onCkeditorReady(editor: DocumentEditor): void {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());

  }

  initializeForm() {
    this.topicForm = new FormGroup({
      title: new FormControl('', Validators.required),
      forum_id: new FormControl(this.forum_id ? this.forum_id : '' , Validators.required),
      status: new FormControl('', Validators.required),
      notify_by_email: new FormControl(0),
    });
  }

  prepareForm(topic: any) {
    if (!topic) {
      return;
    }

    this.topicForm.patchValue({
      title: topic.title,
      forum_id: topic.forum_id,
      status: topic.status,
      notify_by_email: topic.notify_by_email
    });
  }


  onSubmit() {
    if (this.editTopiId == null) {
      this.createTopic();
    } else {
      this.updateTopic();
    }
  }

  createTopic() {
    const formValues = this.topicForm.value;

    this.spinnerService.show();
    const newTopicSubscription = this.forumService.addTopic(formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        console.log(result);

        this.router.navigate(['/dashboard/topics/all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(newTopicSubscription);
  }

  updateTopic() {
    const formValues = this.topicForm.value;

    this.spinnerService.show();
    const updateTopicSubscription = this.forumService.updateTopic(this.editTopiId, formValues).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        // console.log(result);
        
        this.router.navigate(['/dashboard/topics/all']);
        this.snackbar.openSnackBar(result.message);
      },
      (error) => {
        this.spinnerService.hide();

        this.snackbar.openSnackBar(error.error.message, 'Close', 'warn');
      }
    );

    this.subscriptions.add(updateTopicSubscription);
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
