import { Component, computed, EventEmitter, input, linkedSignal, Output } from '@angular/core';
import { SecondsToTimePipe } from '../../pipes/seconds-to-time.pipe';

@Component({
    selector: 'app-seeker',
    imports: [SecondsToTimePipe],
    templateUrl: './seeker.component.html',
    styleUrl: './seeker.component.scss',
})
export class SeekerComponent {
    min = input(0);
    max = input.required<number>();
    progress = input.required<number>();

    @Output() seekEvent = new EventEmitter<number>();

    progressPercentage = computed(() => {
        const percentageFloat = (this.progress() / this.max()) * 100;
        console.log(percentageFloat.toFixed(2));
        return `${percentageFloat.toFixed(2)}%`;
    });

    seek(e: MouseEvent) {
        const target: HTMLDivElement = <HTMLDivElement>e.target;
        const maxWidth = target.clientWidth;
        const pointer = e.offsetX;
        const offset = pointer / maxWidth;
        const newProgress = this.max() * offset;
        console.log({ pointer, maxWidth, offset, newProgress });
        this.seekEvent.emit(parseFloat(newProgress.toFixed(5)));
    }
}
