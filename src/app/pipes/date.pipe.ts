import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
    name: 'dateExactly'
})

export class DateExactly implements PipeTransform {
  transform(value: string): Date {
      
    let date: Date = moment(value, 'YYYY-MM-DDTHH:mm:ss')['_d'];

    return date;

        
    }
}