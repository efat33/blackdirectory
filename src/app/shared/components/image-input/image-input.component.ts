import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { timeoutWith } from 'rxjs/operators';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.css'],
})
export class ImageInputComponent implements OnChanges {
  @Input() text: string = '';
  @Input() value: File = null;
  @Output() fileChange = new EventEmitter<null | File>(null);
  file = null;
  fileStr = '';
  showDelete = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.value && changes.value.currentValue) {
      this.preview(this.value);
    } else {
      this.file = null;
      this.fileStr = '';
    }
  }

  onFileDropped(file: any): void {
    this.preview(file as File);
    this.fileChange.emit(file);
  }

  onImageChange(e) {
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      this.preview(file);
      this.fileChange.emit(file);
    }
  }

  preview(file: File): void {
    const reader = new FileReader();
    this.file = file;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.fileStr = reader.result as string;
      this.showDelete = false;
    };
  }

  deleteImage() {
    this.file = null;
    this.fileStr = '';
    this.fileChange.emit(null);
  }
}
