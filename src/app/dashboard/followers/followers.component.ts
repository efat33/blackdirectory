import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class UserFollowerComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();



  constructor(
    
  ) { }

  ngOnInit() {
    
  }

  

  ngOnDestroy() {
    
  }


}
