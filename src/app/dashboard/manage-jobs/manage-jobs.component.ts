import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-jobs',
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.css']
})
export class ManageJobsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();



  constructor(
    
  ) { }

  ngOnInit() {
    
  }

  

  ngOnDestroy() {
    
  }


}
