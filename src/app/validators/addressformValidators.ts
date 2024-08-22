import { FormControl } from '@angular/forms';

export function checkNumberOrNot(
  control: FormControl
): { [s: string]: boolean } | null {
  let hasUpper = /[A-Z]/.test(control.value);
  let hasLower = /[a-z]/.test(control.value);
  let special = /[$@$!%*?&./]/.test(control.value);
  if (hasUpper || hasLower || (special && control.value)) {
    return { number: true };
  }

  return null;
}

export function checkStringOrNot(
  control: FormControl
): { [s: string]: boolean } | null {
  let hasUpper = /[A-Z]/.test(control.value);
  let hasLower = /[a-z]/.test(control.value);
  let special = /[.]/.test(control.value);
  let hasNumber = /\d/.test(control.value);
  if (!hasUpper && !hasLower && !special && control.value) {
    return { string: true };
  } else if (hasNumber) {
    return { string: true };
  }
  return null;
}

export function dateValidators(
  control: FormControl
): { [s: string]: boolean } | null {
  let validPattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.test(control.value);

  let [date, month, year] = control.value.split('/');

  let currentyear = new Date().getFullYear();

  if (!validPattern && control.value) {
    return { date: true };
  } else if (date < 1 && date > 31 && control.value) {
    return { date: true };
  } else if (month < 1 && month > 12 && control.value) {
    return { date: true };
  } else if (year > currentyear && control.value) {
    return { date: true };
  }
  return null;
}
