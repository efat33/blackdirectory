import { Component, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from './shared/spinner.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'blackdirectory';

  showLoadingSpinner = false;

  constructor(
    private spinnerService: SpinnerService,
    private cdk: ChangeDetectorRef,
    private userService: UserService
  ) { }

  ngOnInit() {

    this.spinnerService.status.subscribe((val: boolean) => {
      this.showLoadingSpinner = val;
      this.cdk.detectChanges();
    });

    this.checkAuthentication();
  }

  checkAuthentication() {
    // check if the user is logged in 
    this.userService.isAuthenticated().then(
      (res) => {
        // set current user to localstorage
        localStorage.setItem('currentUserInfo', JSON.stringify(res.data));
      },
      (res) => {
        // remove user data from localstorage
        localStorage.removeItem('currentUserInfo');
      }
    );
  }

  onActivate(event: Event) {
    window.scrollTo(0, 0);
  }

}
