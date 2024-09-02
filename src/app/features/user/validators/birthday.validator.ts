import {AbstractControl, ValidationErrors} from "@angular/forms";

export const birthdayValidator = (control: AbstractControl): ValidationErrors | null => {
  const todayDate = new Date();
  const todayString = `${todayDate.toLocaleDateString("en-US", {year: 'numeric'})}-${todayDate.toLocaleDateString("en-US", {month: '2-digit'})}-${todayDate.toLocaleDateString("en-US", {day: '2-digit'})}`;
  const isValid = Number(new Date(control.value)) <= Number(new Date(todayString));

  return isValid ? null : {invalidBirthday: true};
}
