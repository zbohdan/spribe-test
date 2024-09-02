import {map, Observable} from "rxjs";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {UserService} from "@core/services/user.service";

export function usernameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkUsername(control.value).pipe(
      map((res) =>
        res.isAvailable ? null : {invalidUsername: true}
      ),
    );
  };
}
