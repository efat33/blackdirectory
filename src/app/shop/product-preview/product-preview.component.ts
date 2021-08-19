import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css'],
})
export class ProductPreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('container') containerRef: ElementRef<HTMLDivElement>;
  @ViewChild('image') imageRef: ElementRef<HTMLImageElement>;

  resizeObservable$ = fromEvent(window, 'resize');
  width: number = 250;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.resizeObservable$.pipe(startWith(''), debounceTime(5)).subscribe((evt) => {
      this.width = this.containerRef.nativeElement.offsetWidth;
      this.imageRef.nativeElement.style.maxWidth = `${this.width}px`;
      this.imageRef.nativeElement.style.height = `${this.width}px`;
    });
  }
}
