import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorite-jobs',
  templateUrl: './favorite-jobs.component.html',
  styleUrls: ['./favorite-jobs.component.css']
})
export class FavoriteJobsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();



  constructor(
    
  ) { }

  ngOnInit() {
    
  }

  

  ngOnDestroy() {
    
  }


}
