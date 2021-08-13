import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dropFile]',
})
export class DropFileDirective {
  @HostBinding('class.file-over') fileOver!: boolean;
  @Output() fileDropped = new EventEmitter<File>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files[0]);
    }
  }
}
