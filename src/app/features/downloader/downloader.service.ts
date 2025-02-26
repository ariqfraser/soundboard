import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DownloaderService {
    constructor() {}

    async download(videoID: string) {
        try {
            const res = await window.electronAPI.downloadVideo(videoID);
            console.log(res);
        } catch (e: any) {
            console.log('e', e);
        }
    }
}
