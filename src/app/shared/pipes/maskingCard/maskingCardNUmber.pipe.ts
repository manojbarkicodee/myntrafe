import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskingCardNumber',
})
export class MaskingCardNumberPipe implements PipeTransform {
  transform(cardNumber: string, ...args: unknown[]): string {
    cardNumber = cardNumber.toString();
    var lastDigits = cardNumber.substring(12, 16);

    var requiredMask =
      new Array(4).fill('X').join('') +
      ' ' +
      new Array(4).fill('X').join('') +
      ' ' +
      new Array(4).fill('X').join('');

    var maskedString = requiredMask + ' ' + lastDigits;

    return maskedString;
  }
}
