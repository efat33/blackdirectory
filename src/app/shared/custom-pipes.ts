import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
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

    return `${this.helperService.apiUrl}/uploads/${folder}/${image}`;
  }
}

@Pipe({name: 'fileSrc'})
export class fileSrc implements PipeTransform {
  constructor(private helperService: HelperService) {}

  transform(value: string, folder: string): string {
    return `${this.helperService.apiUrl}/uploads/${folder}/${value}`;
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

@Pipe({ name: 'rsvpTimeLeft' })
export class rsvpTimeLeft implements PipeTransform {
  constructor(private helperService: HelperService) {}

  transform(end_time: any): string {
    const today = this.helperService.dateNow();
    const end_date = moment(end_time).format("YYYY-MM-DD");
    const dayDiff = Math.abs(
      moment(today, 'YYYY-MM-DD')
        .startOf('day')
        .diff(moment(end_date, 'YYYY-MM-DD').startOf('day'), 'days')
    );

    if(dayDiff == 0){
      return 'Last day'
    }
    else{
      const day_string = dayDiff > 1 ? 'days' : 'day';
      return dayDiff + ' ' + day_string + ' left';
    }
  }
}

@Pipe({ name: 'excerpt' })
export class excerpt implements PipeTransform {
  transform(textIn: any, length: number = 50): string {
    const text =new DOMParser().parseFromString(textIn, "text/html").documentElement.textContent
    const word_count = text.split(' ').length;

    if (word_count > length) {
      return text.split(" ").splice(0, length).join(" ") + ' […]';
    }
    return 'text';
  }
}

@Pipe({ name: 'decimalPipe' })
export class decimalPipe implements PipeTransform {
  transform(input: any): any {
    return parseFloat(input).toFixed(2).replace(/[.,]00$/, "");
  }
}
