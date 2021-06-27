import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';
import { SpinnerService } from 'src/app/shared/spinner.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/shared/snackbar.service';

export interface DialogData {
    message: string;
}

@Component({
    selector: 'login-modal',
    templateUrl: 'login-modal.html',
    styleUrls: ['login-modal.css']
})

export class LoginModal implements OnInit {

    loginForm: FormGroup;
    showError = false;
    errorMessage:string[];
    subscriptions = new Subscription();

    constructor(
        public dialogRef: MatDialogRef<LoginModal>, 
        private userService: UserService,
        private spinnerService: SpinnerService,
        private router: Router,
        private snackbar: SnackBarService
    ) {}

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });

        this.loginForm.valueChanges.subscribe(x => {
            this.emptyErrorMsg();
        });
    }

    onSubmit() {
        // empty existing error messages
        this.emptyErrorMsg();

        // this.spinnerService.show();
        const subscriptionLoginUser = this.userService.loginUser(this.loginForm.value).subscribe(
            (result: any) => {
                // set current user to localstorage
                localStorage.setItem('currentUserInfo', JSON.stringify(result.data));

                this.spinnerService.hide();
                
                // close reg modal
                this.dialogRef.close();

                // redirect user to dashboard
                // this.router.navigate(['dashboard']);
                location.reload();
                this.snackbar.openSnackBar(result.message);

            },
            (result: any) => {
                if(result.error.errors){
                    for (const iterator of result.error.errors) {
                        this.errorMessage.push(iterator.msg);
                    }
                }
                else{
                    this.errorMessage.push(result.error.message);
                }
                
                this.showError = true;
                this.spinnerService.hide();
            }
        );

        this.subscriptions.add(subscriptionLoginUser);
    }

    emptyErrorMsg() {
        this.showError = false;
        this.errorMessage = [];
    }

    registerClicked() {
        this.userService.clickedRegisterLinkModal.emit();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}