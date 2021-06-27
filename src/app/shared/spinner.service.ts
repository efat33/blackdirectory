import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private count = 0;

  show() {
    if (this.count === 0) {
      this.status.next(true);
    }

    this.count++;
  }

  hide() {
    this.count--;
    this.count = Math.max(this.count, 0);

    if (this.count === 0) {
      this.status.next(false);
    }
  }
}
