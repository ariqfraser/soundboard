import {
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    linkedSignal,
    signal,
} from '@angular/core';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DownloaderService } from './downloader.service';
import { AsyncPipe } from '@angular/common';
import { DownloadItemComponent } from './ui/download-item/download-item.component';
import { map } from 'rxjs';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { DownloadItem } from './downloader.types';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
    selector: 'app-downloader',
    imports: [IconComponent, AsyncPipe, DownloadItemComponent, OverlayModule],
    templateUrl: './downloader.component.html',
    styleUrl: './downloader.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DownloaderComponent {
    private readonly sanitiser = inject(DomSanitizer);
    private readonly downloader = inject(DownloaderService);
    protected videoURL = signal<string>('');
    protected videoID = linkedSignal({ source: this.videoURL, computation: () => '' });
    protected embedSrc = computed(() => {
        return this.sanitiser.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${this.videoID()}`,
        );
    });
    protected history$ = this.downloader.history$.pipe(
        map((history) => {
            return history.sort((a, b) => a.startTime - b.startTime);
        }),
    );
    detailsIsOpen = false;
    details = signal<Partial<DownloadItem>>({});

    onURLChange(value: string) {
        this.videoURL.set(value);

        const match = value.match(/\?v=(?=(.+)&|(.+)$)/);

        if (match && (match[1] || match[2])) {
            const videoID = match[1] || match[2];
            this.videoID.set(videoID);
            return;
        }
    }

    download() {
        if (this.videoID().trim()) this.downloader.download(this.videoID());
    }

    // TODO VIEW LOGS
    openDownloadDetails(data: DownloadItem) {
        // this.detailsIsOpen = true;
        // this.details.set(data);
    }
}
