import { Injectable } from '@angular/core';
import { ElectronApiService } from '../../services/electron-api/electron-api.service';
import { NotificationService } from '../../services/notification/notification.service';
import { BehaviorSubject, Subject } from 'rxjs';
import {
    DownloadStartedAPIRes,
    DownloadProgressAPIRes,
    DownloadCompletedAPIRes,
} from '../../services/electron-api/electron-api.types';
import { DownloadID, DownloadItem } from './downloader.types';

@Injectable({
    providedIn: 'root',
})
export class DownloaderService {
    private _downloadStarted$ = new Subject<DownloadStartedAPIRes>();
    downloadStarted$ = this._downloadStarted$.asObservable();

    private _downloadProgress$ = new Subject<DownloadProgressAPIRes>();
    downloadProgress$ = this._downloadProgress$.asObservable();

    private _downloadCompleted$ = new Subject<DownloadCompletedAPIRes>();
    downloadCompleted$ = this._downloadCompleted$.asObservable();

    private history = new Map<DownloadID, DownloadItem>();
    history$ = new BehaviorSubject<DownloadItem[]>([]);

    constructor(
        private electron: ElectronApiService,
        private notification: NotificationService,
    ) {
        if (this.electron.isElectron) {
            window.electronAPI.onDownloadStarted((data) => {
                console.log('download-started', data);
                this._downloadStarted$.next(data);
                this.notification.show(
                    'Download Started!',
                    `Download [${data.videoID}] has started.`,
                    'warning',
                );

                this.updateHistory(data as Partial<DownloadItem>);
            });

            window.electronAPI.onDownloadProgress((data) => {
                console.log('download-progress', data);
                this._downloadProgress$.next(data);
                this.updateHistory(data);
            });

            window.electronAPI.onDownloadCompleted((data) => {
                console.log('download-completed', data);
                this._downloadCompleted$.next(data);
                this.notification.show('Download complete!', data.fileName, 'success', 5000);
                this.updateHistory(data);
            });
        }

        const storedHistory = window.localStorage.getItem('DOWNLOAD_HISTORY');

        if (storedHistory) {
            const parsedArr: [DownloadID, DownloadItem][] = JSON.parse(storedHistory);
            this.history = new Map(parsedArr);
            this.history$.next([...this.history.values()]);
        }
    }

    private mergeDownloadItems(
        data: Partial<DownloadItem>,
        origin: Partial<DownloadItem> = {},
    ): DownloadItem {
        return {
            ...origin,
            downloadID: data.downloadID ?? origin.downloadID ?? 'ERROR_ID',
            duration: data.duration ?? origin.duration ?? 0,
            fileName: data.fileName ?? origin.fileName ?? 'waiting...',
            output: data.output ?? origin.output ?? [],
            progress: data.progress ?? origin.progress ?? 0,
            startTime: data.startTime ?? origin.startTime ?? 0,
            status: data.status ?? origin.status ?? 'downloading',
            videoID: data.videoID ?? origin.videoID ?? '...',
        };
    }

    private updateHistory(data: Partial<DownloadItem>): void {
        if (!data.downloadID) return;
        if (this.history.has(data.downloadID)) {
            this.history.set(data.downloadID, this.mergeDownloadItems(data));
        } else {
            const origin = this.history.get(data.downloadID);
            this.history.set(data.downloadID, this.mergeDownloadItems(data, origin));
        }

        this.history$.next([...this.history.values()]);

        window.localStorage.setItem(
            'DOWNLOAD_HISTORY',
            JSON.stringify(Array.from(this.history.entries())),
        );
    }

    async download(videoID: string) {
        try {
            const res = await window.electronAPI.downloadVideo(videoID);
            console.log(res);
        } catch (e: any) {
            console.log('e', e);
        }
    }
}
