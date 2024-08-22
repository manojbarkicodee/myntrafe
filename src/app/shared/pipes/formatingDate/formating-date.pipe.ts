import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatingDate',
})
export class FormatingDatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    let [year, month, date] = value.split('-');

    return month + '/' + year.slice(2, 4);
  }
}
