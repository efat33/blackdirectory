import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-applied-jobs',
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.css']
})
export class AppliedJobsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();



  constructor(
    
  ) { }

  ngOnInit() {
    
  }

  

  ngOnDestroy() {
    
  }


}
