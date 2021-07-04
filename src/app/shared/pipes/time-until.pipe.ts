import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeUntil',
  pure: true,
})
export class TimeUntilPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      let seconds = Math.floor((+new Date(value) - +new Date()) / 1000);

      if (seconds <= 0) {
        return '';
      }

      if (seconds < 60) {
        return seconds + 's';
      }

      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };

      const output = [];

      if (seconds > intervals.year) {
        const year = Math.floor(seconds / intervals.year);
        output.push(year + 'y');

        seconds = seconds % intervals.year;
      }

      if (seconds > intervals.month) {
        const month = Math.floor(seconds / intervals.month);
        output.push(month + 'm');

        seconds = seconds % intervals.month;
      }

      if (seconds > intervals.day) {
        const day = Math.floor(seconds / intervals.day);
        output.push(day + 'd');

        seconds = seconds % intervals.day;
      }

      if (seconds > intervals.hour) {
        const hour = Math.floor(seconds / intervals.hour);
        output.push(hour + 'h');

        seconds = seconds % intervals.hour;
      }

      if (seconds > intervals.minute) {
        const minute = Math.floor(seconds / intervals.minute);
        output.push(minute + 'min');

        seconds = seconds % intervals.minute;
      }

      return output.join(' ');
    }

    return value;
  }
}
