import {Component, EventEmitter, Input, Output} from '@angular/core';
import {map, Observable, Subject, take, takeUntil, tap, timer} from "rxjs";
import {FormatDurationPipe} from "@shared/pipes/format-duration.pipe";

@Component({
  selector: 'app-delayed-submit-button',
  standalone: true,
  imports: [
    FormatDurationPipe
  ],
  templateUrl: './delayed-submit-button.component.html',
  styleUrl: './delayed-submit-button.component.scss'
})
export class DelayedSubmitButtonComponent {
  @Input() isSubmitDisabled = false;

  @Input() set delay(d: number) {
    this.submitCountdown = d;
    this._delay = d;
  }

  get delay(): number {
    return this._delay
  }

  @Input() submitBtnText = 'Submit';
  @Input() cancelBtnText = 'Cancel';

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  submitCountdown!: number;
  isSubmitCountdownStarted = false;
  cancelSubmitSubject = new Subject<void>();

  private _delay!: number;

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  startSubmitCountdown(): Observable<boolean> {
    this.isSubmitCountdownStarted = true;

    return timer(1000, 1000).pipe(
      tap(() => {
        this.submitCountdown -= 1;
      }),
      map(() => !this.submitCountdown),
      take(this.delay),
      takeUntil(this.cancelSubmitSubject),
    );
  }

  resetSubmitState(): void {
    this.isSubmitCountdownStarted = false;
    this.submitCountdown = this.delay;
  }
}
