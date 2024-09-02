import {Directive, ElementRef, HostBinding, inject, Input} from '@angular/core';
import {NgControl} from "@angular/forms";
import {UserFormLabel} from "@features/user/enums/user-form-label.enum";
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[appInputValidator]',
  standalone: true
})
export class InputValidatorDirective {
  @Input() set errorInputName(displayName: UserFormLabel) {
    const element = this.elementRef.nativeElement;
    const div = this.createDivWithValidationMessage(displayName);
    element.parentNode.insertBefore(div, element.nextSibling);
  }

  @HostBinding('class.is-valid') get isValid() {
    return this.control.touched && this.control.valid;
  }

  @HostBinding('class.is-invalid') get isInvalid() {
    return this.control.touched && this.control.invalid;
  }

  private control = inject(NgControl);
  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);

  private createDivWithValidationMessage(displayName: UserFormLabel): HTMLDivElement {
    const div = this.document.createElement("div");
    const divContent = this.document.createTextNode(`Please provide a correct ${displayName.toLowerCase()}`);
    div.appendChild(divContent);
    div.classList.add("invalid-feedback", "position-absolute");

    return div;
  }
}
