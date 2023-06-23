import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'sizeFile'
})

export class SizeFile implements PipeTransform {
  transform(value: number): number {

    return Number.parseFloat(`${((value / 1024) / 1024).toFixed(2)}`)
        
  }
}