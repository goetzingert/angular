import { Pipe, PipeTransform } from '@angular/core';

const oneDayInMillis = 1000 * 60 * 60 * 24;

@Pipe({
  name: 'takePlaceSoon',
  standalone:false
})
export class TakePlaceSoonPipe implements PipeTransform {

  transform(date: Date | undefined, soon = 7): boolean {
    if(!date)
      return false;
    const timeTo = date.getTime() - Date.now();

    const soonInMilliSeconds = soon * oneDayInMillis;
    return timeTo > 0 && timeTo < soonInMilliSeconds;
  }

}
