import { FormControl } from '@angular/forms';

export function checkdate(
  control: FormControl
): { [s: string]: boolean } | null {
  let value = control.value;
  let checkFormat = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value);
  let currentYear = new Date().getFullYear().toString();
  currentYear = currentYear.slice(2, 4);
  let [month, year] = value.split('/');
  if (!checkFormat && value) {
    return { date: true };
  } else if (year < currentYear && value) {
    return { date: true };
  }

  return null;
}
