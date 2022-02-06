import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-page-contact-us',
  templateUrl: './page-contact-us.component.html',
  styleUrls: ['./page-contact-us.component.scss'],
})
export class PageContactUsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  contactUsForm: FormGroup;
  loading: boolean = false;
  message: string = '';

  constructor(private helperService: HelperService) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.contactUsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

  onSubmit(form: FormGroupDirective) {
    const formValues = this.contactUsForm.value;

    const body = {
      subject: `Contact form submission - ${formValues.subject}`,
      body: `
<strong>From:</strong> ${formValues.name} <${formValues.email}>
<strong>Subject:</strong> ${formValues.subject}

<strong>Message Body:</strong>
${formValues.message.replace(/(?:\r\n|\r|\n)/g, '<br>')}`,
    };

    this.loading = true;
    const subscription = this.helperService.sendMail(body).subscribe(
      (result: any) => {
        this.loading = false;
        this.message = 'Thank you for contacting us. We will get in touch with you shortly.';

        this.contactUsForm.reset();
        form.resetForm();

        setTimeout(() => {
          this.message = null;
        }, 5000);
      },
      (error) => {
        this.loading = false;
        this.message = error.error.message || 'Something went wrong, please try again.';

        setTimeout(() => {
          this.message = null;
        }, 5000);
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
