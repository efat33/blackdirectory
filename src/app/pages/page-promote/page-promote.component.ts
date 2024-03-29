import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { HelperService } from 'src/app/shared/helper.service';
import { SeoService } from 'src/app/shared/services/seo.service';

@Component({
  selector: 'app-page-promote',
  templateUrl: './page-promote.component.html',
  styleUrls: ['./page-promote.component.scss'],
})
export class PagePromoteComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  advertiseWithUsForm: FormGroup;
  loading: boolean = false;
  message: string = '';

  constructor(
    private helperService: HelperService,
    private seo: SeoService
  ) {}

  ngOnInit() {

    // setup SEO data
    this.seo.generateTags({
      title: 'Advertise With Us', 
      description: 'Advertise With Us', 
      image: 'https://www.blackdirectory.co.uk/assets/img/BD-LOGO.png',
      slug: 'promote',
      keywords: 'promote',
    });

    this.initializeForm();
  }

  initializeForm() {
    this.advertiseWithUsForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
  }

  onSubmit(form: FormGroupDirective) {
    const formValues = this.advertiseWithUsForm.value;

    const body = {
      subject: `Advertise form submission - ${formValues.subject}`,
      body: `
From: ${formValues.name}
Email: ${formValues.email}
Subject: ${formValues.subject}

${formValues.message.replace(/(?:\r\n|\r|\n)/g, '<br>')}`,
    };

    this.loading = true;
    const subscription = this.helperService.sendMail(body).subscribe(
      (result: any) => {
        this.loading = false;
        this.message = 'Thank you for contacting us. We will get in touch with you shortly.';

        this.advertiseWithUsForm.reset();
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
