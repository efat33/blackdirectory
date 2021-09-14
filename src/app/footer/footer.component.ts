import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SnackBarService } from '../shared/snackbar.service';
import { SpinnerService } from '../shared/spinner.service';

interface MailChimpResponse {
  result: string;
  msg: string;
}


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  subscriptions = new Subscription();

  mailchimpForm: FormGroup;
  showError = false;
  errorMessage = '';

	mailChimpEndpoint = 'https://gmail.us5.list-manage.com/subscribe/post-json?u=1e4bb3c213207514e9ccc018f&amp;id=10ec512531';
	

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event){
    this.pageYoffset = window.pageYOffset;
  }
  
  constructor(
    private http: HttpClient,
    private snackbar: SnackBarService,
    private spinnerService: SpinnerService,
  ) { }

  ngOnInit() {
    this.mailchimpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmitSubscription(){
    if(!this.mailchimpForm.valid){
      this.snackbar.openSnackBar("Please enter an valid email address", '', 'warn');
      return;
    }

    const params = new HttpParams()
      .set('EMAIL', this.mailchimpForm.controls['email'].value)
      .set('subscribe', 'Subscribe');

    const mailChimpUrl = this.mailChimpEndpoint + '&' + params.toString();

    this.spinnerService.show();

    // 'c' refers to the jsonp callback param key. This is specific to Mailchimp
    this.http.jsonp<MailChimpResponse>(mailChimpUrl, 'c').subscribe(response => {
      this.spinnerService.hide();
      if (response.result && response.result !== 'error') {
        this.mailchimpForm.reset();
        this.snackbar.openSnackBar(response.msg);
      }
      else {
        const already_subscribed = 'is already subscribed to list';
        if(response.msg.includes(already_subscribed)){
          this.snackbar.openSnackBar('This email is already subscribed', '', 'warn');
        }
        else{
          this.snackbar.openSnackBar(response.msg, 'Close', 'warn');
        }
      }
    }, error => {
      this.spinnerService.hide();
      console.error(error);
    });
    
  }


  scrollToTop(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

}
