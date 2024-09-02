import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'appFormatDuration',
  standalone: true
})
export class FormatDurationPipe implements PipeTransform {
  transform(seconds: number): string {
    const secondsInMinute = 60;
    const minutesInHour = 60;

    const secondsLeft = seconds % secondsInMinute;
    const minutes = Math.floor(seconds / secondsInMinute);
    const minutesLeft = minutes % minutesInHour;
    const hours = Math.floor(minutes / minutesInHour);

    return `${this.formatValue(hours)}:${this.formatValue(minutesLeft)}:${this.formatValue(secondsLeft)}`;
  }

  private formatValue(timeValue: number): string {
    return String(timeValue).padStart(2, '0');
  }
}
