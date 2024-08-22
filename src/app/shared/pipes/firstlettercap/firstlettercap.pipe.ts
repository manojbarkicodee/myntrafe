import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstlettercap',
})
export class FirstlettercapPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    let newvalue = value.charAt(0).toUpperCase() + value.slice(1);
    return newvalue;
  }
}
