import { inject, Injectable, signal } from '@angular/core';
import { TrackData } from './audio-player.types';
import { interval } from 'rxjs';
import { ExplorerItem } from '../../core/ui/explorer/explorer.types';

@Injectable({
    providedIn: 'root',
})
export class AudioPlayerService {
    private track?: HTMLAudioElement;

    trackData = signal<TrackData>({ currentTime: 0, duration: 0, isPaused: true, name: '...' });

    private _vol = signal<number>(0.5);
    vol = this._vol.asReadonly();

    constructor() {
        interval(100).subscribe(() => {
            if (!this.trackData()) return;
            // @ts-ignore
            this.trackData.update((data: TrackData) => ({
                ...data,
                currentTime: this.track?.currentTime ?? 0,
            }));
        });
    }

    play() {
        this.track?.play();
        // @ts-ignore
        if (this.trackData()) this.trackData.update((data) => ({ ...data, isPaused: false }));
    }

    pause() {
        this.track?.pause();
        // @ts-ignore
        if (this.trackData()) this.trackData.update((data) => ({ ...data, isPaused: true }));
    }

    setVolume(vol: number) {
        vol = parseFloat(vol.toFixed(2));
        this._vol.set(vol);
        if (this.track) this.track.volume = vol;
    }

    setCurrentTime(time: number) {
        if (this.track) this.track.currentTime = time;
        console.log('Setting currentTime: ' + time, this.trackData());
    }

    togglePlay() {
        if (this.track?.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    directPlay(file: ExplorerItem) {
        this.pause();
        this.track = new Audio(file.fullPath);
        this.track.volume = this._vol();
        this.play();
        setTimeout(() => {
            this.trackData.set({
                name: file.name,
                duration: this.track?.duration ?? 0,
                currentTime: 0,
                isPaused: this.track?.paused ?? true,
            });
        }, 1000);
    }
}
