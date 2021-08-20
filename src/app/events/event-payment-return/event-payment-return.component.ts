import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-event-payment-return',
  templateUrl: './event-payment-return.component.html',
  styleUrls: ['./event-payment-return.component.scss'],
})
export class EventPaymentReturnComponent implements OnInit {
  success: boolean = true;
  eventSlug: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.pipe(filter((params) => params.success)).subscribe((params) => {
      this.success = params.success === 'true';
    });

    this.eventSlug = this.route.snapshot.paramMap.get('slug');
  }
}
