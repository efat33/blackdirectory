import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { UserService } from 'src/app/user/user.service';
import { SpinnerService } from '../../../shared/spinner.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/snackbar.service';

export interface DialogData {
    message: string;
}

@Component({
    selector: 'registration-modal',
    templateUrl: 'registration-modal.html',
    styleUrls: ['registration-modal.css']
})

export class RegistrationModal implements OnInit {

    registrationForm: FormGroup;
    showError = false;
    errorMessage:string[];
    subscriptions = new Subscription();
    submitted = false;

    constructor(
        public dialogRef: MatDialogRef<RegistrationModal>,
        private userService: UserService,
        private spinnerService: SpinnerService,
        private router: Router,
        private snackbar: SnackBarService
    ) {}

    // convenience getter for easy access to form fields
    get f() { return this.registrationForm.controls; }

    ngOnInit(): void {
        this.registrationForm = new FormGroup({
            username: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,})')]),
            agreed: new FormControl(''),
            job_employer: new FormControl('')
          });

        this.registrationForm.valueChanges.subscribe(x => {
            this.emptyErrorMsg();
        });
    }

    

    onSubmit() {

        // empty existing error messages
        this.emptyErrorMsg();

        this.submitted = true;

        // check if the terms condition is agreed
        if(!this.f.agreed.value){
            return;
        }

        this.spinnerService.show();
        const subscriptionAddUser = this.userService.addUser(this.registrationForm.value).subscribe(
            (result: any) => {
                // set current user to localstorage
                localStorage.setItem('currentUserInfo', JSON.stringify(result.data));
                
                this.spinnerService.hide();
                
                // close reg modal
                this.dialogRef.close();

                // redirect user to dashboard
                // this.router.navigate(['dashboard']);

                location.reload();
                // show successful message
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

        this.subscriptions.add(subscriptionAddUser);
    }

    emptyErrorMsg() {
        this.showError = false;
        this.errorMessage = [];
    }

    accountLinkClicked() {
        this.userService.clickedLoginLinkModal.emit();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}