import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, startWith} from "rxjs";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {Component, DestroyRef, EventEmitter, inject, OnInit, Optional, Output, Self} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule
} from "@angular/forms";
import {InputValidatorDirective} from "@shared/directives/input-validator.directive";
import {Country} from "@shared/enums/country.enum";
import {UserService} from "@core/services/user.service";
import {countryValidator} from "@features/user/validators/country.validator";
import {usernameValidator} from "@features/user/validators/username.validator";
import {birthdayValidator} from "@features/user/validators/birthday.validator";
import {User} from "../../interfaces/user.interface";
import {UserFormField} from "../../enums/user-form-field.enum";
import {UserFormLabel} from "../../enums/user-form-label.enum";

@Component({
  selector: 'app-user-form-card',
  standalone: true,
  imports: [
    FormsModule,
    InputValidatorDirective,
    NgbTypeahead,
    ReactiveFormsModule
  ],
  templateUrl: './user-form-card.component.html',
  styleUrl: './user-form-card.component.scss',
})
export class UserFormCardComponent implements ControlValueAccessor, OnInit {
  @Output() remove = new EventEmitter();

  readonly UserFormLabel = UserFormLabel;
  countries: Country[] = Object.values(Country);

  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef)

  private onChange!: (value: User) => void;
  private onTouched!: () => void;


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((text) =>
        this.countries.filter((country) => country.toLowerCase().includes(text.toLowerCase()))
      )
    );

  userFormGroup = new FormGroup<Record<UserFormField, FormControl<string>>>({
    [UserFormField.Country]: new FormControl('', {validators: countryValidator(this.countries), nonNullable: true}),
    [UserFormField.Username]: new FormControl('', {
      asyncValidators: usernameValidator(this.userService),
      nonNullable: true
    }),
    [UserFormField.Birthday]: new FormControl('', {validators: birthdayValidator, nonNullable: true}),
  });

  constructor(@Self() @Optional() private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.setupNgControl();
    this.trackValueChanges();
    this.trackStatusChanges();
  }

  setStateErrorsForParentControl() {
    const isSomeControlInvalid = Object.values(this.userFormGroup.controls).some(c => {
      return c.status === 'INVALID' && c.touched
    });

    if (isSomeControlInvalid) {
      this.ngControl.control!.setErrors({error: true});
      return;
    }

    const isSomeControlPending = Object.values(this.userFormGroup.controls).some(c => {
      return c.status === 'PENDING' && c.touched;
    });

    if (isSomeControlPending) {
      this.ngControl.control!.setErrors({pending: true});
      return;
    }

    this.ngControl.control!.setErrors(null);
  }

  removeUserFormCard(): void {
    this.remove.emit();
  }

  writeValue(obj: { country: string, username: string, birthday: string }): void {
    this.userFormGroup.setValue(obj, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.userFormGroup.disable();
    } else {
      this.userFormGroup.enable();
    }
  }

  onBlur(): void {
    this.setStateErrorsForParentControl();
  }

  private setupNgControl(): void {
    this.ngControl.control!.markAsTouched = () => {
      this.userFormGroup.markAllAsTouched();
      this.setStateErrorsForParentControl();
    }
  }

  private trackValueChanges(): void {
    this.userFormGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((_) => {
      this.onChange(this.userFormGroup.getRawValue());
      this.setStateErrorsForParentControl();
    });
  }

  private trackStatusChanges(): void {
    combineLatest(Object.values(this.userFormGroup.controls).map(control => control.statusChanges.pipe(startWith('VALID'))))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setStateErrorsForParentControl();
      })
  }
}
