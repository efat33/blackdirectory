import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ContactEmployerModal } from 'src/app/modals/job/contact-employer/contact-employer-modal';
import { JobApplyEmailModal } from 'src/app/modals/job/jobapply-email/jobapply-email-modal';
import { JobApplyInternalModal } from 'src/app/modals/job/jobapply-internal/jobapply-internal-modal';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  subsciptions: Subscription = new Subscription();

  jobApplyType = 'internal';
  dialogJobApplyModal: any;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    
  }

  openJobApplyModal(): void {

    if(this.jobApplyType == 'internal'){
      this.dialogJobApplyModal = this.dialog.open(JobApplyInternalModal, {
        width: '550px'
      });
    }
    else if(this.jobApplyType == 'email'){
      this.dialogJobApplyModal = this.dialog.open(JobApplyEmailModal, {
        width: '550px'
      });
    }
    

  }

  openContactEmployerModal(): void {

    this.dialogJobApplyModal = this.dialog.open(ContactEmployerModal, {
      width: '550px'
    });
    
  }


  ngOnDestroy() {
    
  }


}
