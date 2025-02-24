import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AudioPlayerService {
    constructor() {}

    play() {
        const audio = new Audio('1.mp3');
        audio.volume = 0.2;
        // audio.play();

        setTimeout(() => {
            // const audio = new Audio('2.mp3');
            audio.volume = 0.1;
            // audio.play();
        }, 2000);
    }
}
