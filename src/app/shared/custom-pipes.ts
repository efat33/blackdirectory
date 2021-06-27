import { Pipe, PipeTransform } from '@angular/core';



@Pipe({name: 'imageSrc'})
export class imageSrc implements PipeTransform {
  transform(value: string, folder: string, imgSize: string): string {
    const size = imgSize ? imgSize : 'full';

    let image = value;

    if(size != 'full'){
      image = `${size}-${image}`;
    }

    return `http://localhost:3000/${folder}/${image}`;
  }
}