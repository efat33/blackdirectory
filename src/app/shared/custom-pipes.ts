import { Pipe, PipeTransform } from '@angular/core';



@Pipe({name: 'imageSrc'})
export class imageSrc implements PipeTransform {
  transform(value: string, folder: string, imgSize: string = 'full'): string {
    const size = imgSize ? imgSize : 'full';

    let image = value;

    if(size != 'full'){
      image = `${size}-${image}`;
    }

    return `http://localhost:3000/${folder}/${image}`;
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