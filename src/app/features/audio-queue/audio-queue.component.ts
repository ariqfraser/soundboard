import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IconButtonComponent } from '../../shared/ui/icon-button/icon-button.component';
import { SeekerComponent } from '../../shared/ui/seeker/seeker.component';
import { VolumeButtonComponent } from '../../shared/ui/volume-button/volume-button.component';
import { AudioPlayerService } from '../../services/audio-player/audio-player.service';

@Component({
    selector: 'app-audio-queue',
    imports: [IconButtonComponent, JsonPipe, SeekerComponent, VolumeButtonComponent],
    templateUrl: './audio-queue.component.html',
    styleUrl: './audio-queue.component.scss',
})
export class AudioQueueComponent {
    private readonly player = inject(AudioPlayerService);
    trackInfo = this.player.trackData;
    volume = this.player.vol;
    test = signal(window.localStorage.getItem('test') ?? 'NONE SET');

    seek(time: number) {
        this.player.setCurrentTime(time);
    }

    setVolume(vol: number) {
        this.player.setVolume(vol);
    }

    onPlayButtonClick() {
        this.player.togglePlay();
    }
}
