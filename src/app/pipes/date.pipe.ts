import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
    name: 'dateExactly'
})

//hace la resta del año de la fecha actual menos el año de nacimiento del registro para adecuar la
//data en la tabla
export class DateExactly implements PipeTransform {
  transform(value: string): Date {
      
    let date: Date = moment(value, 'YYYY-MM-DDTHH:mm:ss')['_d'];
      

    
      


    return date;

        
    }
}