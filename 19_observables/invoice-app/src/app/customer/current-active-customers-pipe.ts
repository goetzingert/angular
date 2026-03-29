import { Pipe, PipeTransform } from '@angular/core';

const oneDayInMillis = 1000 * 60 * 60 * 24;

@Pipe({
  name: 'currentActiveCustomers',
  standalone: true
})
export class CurrentActiveCustomersPipe implements PipeTransform {

  transform(date: Date | undefined, daysInPast = 7): boolean {
    if(!date)
      return false;
    const timeDiff = Date.now() - date.getTime();
    
    const maxTimeDiffInMS = daysInPast * oneDayInMillis;
    return  timeDiff < maxTimeDiffInMS;
  }

}
