import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class UserFollowingComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();



  constructor(
    
  ) { }

  ngOnInit() {
    
  }

  

  ngOnDestroy() {
    
  }


}
