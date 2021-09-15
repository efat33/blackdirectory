import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HelperService } from '../helper.service';

@Pipe({
  name: 'bdyImage',
})
export class BdyImagePipe implements PipeTransform {
  constructor(private helperService: HelperService, private sanitizer: DomSanitizer) {}

  transform(imageName: string, folder: string, size: 'full' | 'medium' | 'thumb' = 'medium'): unknown {
    return this.helperService.getImageUrl(imageName, folder, size);
    // return this.sanitizer.bypassSecurityTrustUrl(this.helperService.getImageUrl(imageName, folder, size));
  }
}
