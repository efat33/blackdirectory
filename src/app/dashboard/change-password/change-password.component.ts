import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  changePasswordForm: FormGroup;
  showError = false;
  errorMessage = '';

  constructor(

  ) { }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),

    });
  }

  onSubmit() {

  }

  ngOnDestroy() {

  }


}
