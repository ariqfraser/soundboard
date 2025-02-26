import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
    DownloadCompletedAPIRes,
    DownloadProgressAPIRes,
    DownloadStartedAPIRes,
} from './electron-api.types';
import { NotificationService } from '../notification/notification.service';

@Injectable({
    providedIn: 'root',
})
export class ElectronApiService {
    private _downloadStarted$ = new Subject<DownloadStartedAPIRes>();
    downloadStarted$ = this._downloadStarted$.asObservable();

    private _downloadProgress$ = new Subject<DownloadProgressAPIRes>();
    downloadProgress$ = this._downloadProgress$.asObservable();

    private _downloadCompleted$ = new Subject<DownloadCompletedAPIRes>();
    downloadCompleted$ = this._downloadCompleted$.asObservable();

    constructor(private notification: NotificationService) {
        if (this.isElectron) {
            window.electronAPI.onDownloadStarted((data) => {
                console.log('download-started', data);
                this._downloadStarted$.next(data);
                this.notification.add(
                    'Download Started!' + data.videoID,
                    '',
                    'click for more info',
                );
            });

            window.electronAPI.onDownloadProgress((data) => {
                console.log('download-progress', data);
                this._downloadProgress$.next(data);
            });

            window.electronAPI.onDownloadCompleted((data) => {
                console.log('download-completed', data);
                this._downloadCompleted$.next(data);
            });
        }
    }

    get isElectron(): boolean {
        try {
            return window.electronAPI.heartbeat();
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
