import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-job-packages-return',
  templateUrl: './job-packages-return.component.html',
  styleUrls: ['./job-packages-return.component.scss'],
})
export class JobPackagesReturnComponent implements OnInit {
  success: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(filter((params) => params.success)).subscribe((params) => {
      this.success = params.success === 'true';
    });
  }
}
