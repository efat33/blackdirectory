import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { HelperService } from 'src/app/shared/helper.service';
import { JobService } from 'src/app/jobs/jobs.service';

@Component({
  selector: 'app-page-unsubscribe-jobalert',
  templateUrl: './page-unsubscribe-jobalert.component.html',
  styleUrls: ['./page-unsubscribe-jobalert.component.scss'],
})
export class PageUnsubscribeJobalertComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  loading: boolean = false;
  message: string = '';

  params = {
    alertID: '',
    alertKey: '',
  }

  unsubscribed: boolean;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private spinnerService: SpinnerService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.params.alertID = this.route.snapshot.paramMap.get('id');
    this.params.alertKey = this.route.snapshot.paramMap.get('key');

    this.unsubscribeAlert();
  }

  unsubscribeAlert() {
    this.spinnerService.show();
    const subscription = this.jobService.unsubscribeJobAlert(this.params).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        this.unsubscribed = true;
      },
      (error) => {
        this.spinnerService.hide();
        this.unsubscribed = false;
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
