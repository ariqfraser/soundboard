import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-volume-button',
    imports: [IconComponent, OverlayModule],
    templateUrl: './volume-button.component.html',
    styleUrl: './volume-button.component.scss',
})
export class VolumeButtonComponent {
    protected isOpen = false;
    private isDragging = false;
    protected volume = signal<number>(0.5);
    protected overplayPositions: ConnectedPosition[] = [
        {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
        },
        {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
        },
    ];

    @Output() changeEvent = new EventEmitter<number>();

    startDrag(e: MouseEvent) {
        this.isDragging = true;
        this.setVol(e);
    }

    @HostListener('document:mouseup')
    stopDrag() {
        this.isDragging = false;
    }

    setVol(e: MouseEvent) {
        if (!this.isDragging) return;
        const target = <HTMLDivElement>e.target;
        const height = target.offsetHeight;
        const volume = 1 - e.offsetY / height;
        const snappedVolume = volume < 0.05 ? 0 : volume;

        const roundedVolume = parseFloat(snappedVolume.toFixed(2));
        this.changeEvent.emit(roundedVolume);
        this.volume.set(roundedVolume * 100);
    }
}
