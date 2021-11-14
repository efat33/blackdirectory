import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-user-checkout-payment-return',
  templateUrl: './checkout-payment-return.component.html',
  styleUrls: ['./checkout-payment-return.component.scss'],
})
export class CheckoutPaymentReturnComponent implements OnInit {
  success: boolean = true;
  checkoutSlug: string;

  constructor(private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit() {
    this.route.queryParams.pipe(filter((params) => params.success)).subscribe((params) => {
      this.success = params.success === 'true';

      if (this.success) {
        this.cartService.clearCart();
      }
    });

    this.checkoutSlug = this.route.snapshot.paramMap.get('slug');
  }
}
