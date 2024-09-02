import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function countryValidator(countries: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return countries.find((country) => country === control.value)
      ? null
      : {invalidCountry: true};
  }
}
