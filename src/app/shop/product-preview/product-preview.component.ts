import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css'],
})
export class ProductPreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('container') containerRef: ElementRef<HTMLDivElement>;
  @ViewChild('image') imageRef: ElementRef<HTMLImageElement>;

  width: number = 250;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.width = this.containerRef.nativeElement.offsetWidth;
    this.imageRef.nativeElement.style.width = `${this.width}px`;
    this.imageRef.nativeElement.style.height = `${this.width}px`;
  }
}
