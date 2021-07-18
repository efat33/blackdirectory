import { Component, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from './shared/spinner.service';

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
    private cdk: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.spinnerService.status.subscribe((val: boolean) => {
      this.showLoadingSpinner = val;
      this.cdk.detectChanges();
    });
  }

  onActivate(event: Event) {
    window.scrollTo(0, 0);
  }

}
