import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-page-email-verification',
  templateUrl: './page-email-verification.component.html',
  styleUrls: ['./page-email-verification.component.scss'],
})
export class PageEmailVerificationComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  contactUsForm: FormGroup;
  loading: boolean = false;
  message: string = '';

  verified: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private spinnerService: SpinnerService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    const verificationKey = this.route.snapshot.paramMap.get('verification-key');

    this.verifyEmail(verificationKey);
  }

  verifyEmail(verificationKey: string) {
    this.spinnerService.show();
    const subscription = this.userService.verifyEmail(verificationKey).subscribe(
      (result: any) => {
        this.spinnerService.hide();

        this.verified = true;
        this.helperService.currentUserInfo.verified = 1;
      },
      (error) => {
        this.spinnerService.hide();

        this.verified = false;
      }
    );

    this.subscriptions.add(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
