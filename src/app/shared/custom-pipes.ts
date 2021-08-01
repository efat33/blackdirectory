import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from './helper.service';



@Pipe({name: 'imageSrc'})
export class imageSrc implements PipeTransform {
  constructor(private helperService: HelperService) {}

  transform(value: string, folder: string, imgSize: string = null): string {
    const size = imgSize ? imgSize : 'full';

    let image = value;

    if(size != 'full'){
      image = `${size}-${image}`;
    }

    return `${this.helperService.apiUrl}/${folder}/${image}`;
  }
}

@Pipe({name: 'encodeURL'})
export class encodeURL implements PipeTransform {
  transform(url: string): any {
    return  encodeURIComponent(url);
  }
}

@Pipe({ name: 'pluralPipe' })
export class pluralPipe implements PipeTransform {
  transform(input: number, customPluralForm: string = 's'): string {
    return input > 1 ? customPluralForm : ''
  }
}
