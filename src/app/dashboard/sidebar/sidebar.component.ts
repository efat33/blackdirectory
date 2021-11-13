import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helper.service';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class DashboardSidebarComponent implements OnInit {
  userType: string;
  currentUser: any;
  profileImage: string = `${this.helperService.siteUrl}/assets/img/avatar-default.png`;

  constructor(private helperService: HelperService, public userService: UserService) {}

  ngOnInit() {
    if (this.helperService.currentUserInfo) {
      this.currentUser = this.helperService.currentUserInfo;
      this.userType = this.helperService.currentUserInfo.role;

      if (this.currentUser.profile_photo) {
        this.profileImage = this.helperService.getImageUrl(this.currentUser.profile_photo, 'users', 'medium');
      }
    } else {
      // if not authenticated, then logout and redirect to home page
      this.userService.logout();
    }
  }
}
