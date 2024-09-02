import {filter, Subject, switchMap, takeUntil} from "rxjs";
import {Component, DestroyRef, inject, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserService} from "@core/services/user.service";
import {DelayedSubmitButtonComponent} from "@shared/components/delayed-submit-button/delayed-submit-button.component";
import {UserFormCardComponent} from "./components/user-form-card/user-form-card.component";
import {UserCardData} from "./interfaces/user-card-data.interface";
import {User} from "./interfaces/user.interface";
import {UserFormField} from "./enums/user-form-field.enum";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    UserFormCardComponent,
    ReactiveFormsModule,
    DelayedSubmitButtonComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  @ViewChild(DelayedSubmitButtonComponent) userActionButtonsComponent!: DelayedSubmitButtonComponent;

  userCardDataArray: UserCardData[] = [
    this.generateUserCardData(),
  ];
  isAddCardDisabled = false;

  private cancelSubmitSubject = new Subject<void>();
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  get userFormControlArray(): FormControl<User>[] {
    return this.userCardDataArray.map(cardData => cardData.formControl);
  }

  get invalidFormsCount(): number {
    return this.userFormControlArray.filter((form) => form.hasError('error')).length;
  }

  get isSomeFormInPendingState(): boolean {
    return this.userFormControlArray.some((form) => form.hasError('pending'));
  }

  onSubmit(): void {
    this.markAllFormsAsTouched();

    if (!this.invalidFormsCount && !this.isSomeFormInPendingState) {
      this.disableAllCards();
      this.userActionButtonsComponent.startSubmitCountdown()
        .pipe(
          filter((isSubmitCountdownFinished) => isSubmitCountdownFinished),
          switchMap(() =>
            this.userService.submit(this.userFormControlArray.map((userFormControl) => userFormControl.getRawValue()))
          ),
          takeUntil(this.cancelSubmitSubject),
          takeUntilDestroyed(this.destroyRef)
        ).subscribe((_) => {
        this.userActionButtonsComponent.resetSubmitState();
        this.userCardDataArray = [
          this.generateUserCardData(),
        ];
        this.isAddCardDisabled = false;
      });
    }
  }

  onCancel(): void {
    this.enableAllCards();
    this.cancelSubmitSubject.next();
    this.userActionButtonsComponent.resetSubmitState();
  }

  onAddUserCardData(): void {
    this.userCardDataArray.push(this.generateUserCardData());
  }

  onRemoveUserCardData(id: string): void {
    this.userCardDataArray = this.userCardDataArray.filter((userCardData) => userCardData.id !== id);
  }

  private markAllFormsAsTouched(): void {
    this.userFormControlArray.forEach((form) => {
      form.markAsTouched();
    });
  }

  private disableAllCards(): void {
    this.userFormControlArray.forEach((form) => {
      form.disable();
    });
    this.isAddCardDisabled = true;
  }

  private enableAllCards(): void {
    this.userFormControlArray.forEach((form) => {
      form.enable();
    });
    this.isAddCardDisabled = false;
  }

  private generateUserCardData(): UserCardData {
    return {
      id: self.crypto.randomUUID(),
      formControl: this.generateUserFormControl(),
    }
  }

  private generateUserFormControl(): FormControl<User> {
    return new FormControl<User>({
      [UserFormField.Country]: '',
      [UserFormField.Username]: '',
      [UserFormField.Birthday]: '',
    }, {nonNullable: true});
  }
}
