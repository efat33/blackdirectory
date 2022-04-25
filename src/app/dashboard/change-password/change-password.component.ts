import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  changePasswordForm: FormGroup;
  showError = false;
  errorMessage: string[];

  constructor(
    private userService: UserService,
    private spinnerService: SpinnerService,
    private router: Router,
    private snackbar: SnackBarService,
  ) { }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      new_password: new FormControl('', [
        Validators.required,
        Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,})'),
      ]),
      confirm_password: new FormControl('', Validators.required),

    });
  }

  onSubmit() {
    // empty existing error messages
    this.emptyErrorMsg();

    this.spinnerService.show();
    
    const subsChangePassword = this.userService.changePassword(this.changePasswordForm.value).subscribe(
      (res:any) => {
  
        this.spinnerService.hide();
        this.snackbar.openSnackBar(res.message);
    
      },
      (res:any) => {
        if (res.error.errors) {
          for (const iterator of res.error.errors) {
            this.errorMessage.push(iterator.msg);
          }
        } else {
          this.errorMessage.push(res.error.message);
        }

        this.showError = true;
        this.spinnerService.hide();
      }
    );
    
    this.subscriptions.add(subsChangePassword);
  }

  emptyErrorMsg() {
    this.showError = false;
    this.errorMessage = [];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}
