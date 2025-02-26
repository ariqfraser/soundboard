import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secondsToTime',
})
export class SecondsToTimePipe implements PipeTransform {
    transform(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const secondsStr = remainingSeconds.toString().padStart(2, '0');
        return `${minutes.toString().padStart(2, '0')}:${secondsStr}`;
    }
}
