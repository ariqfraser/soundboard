import {
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    linkedSignal,
    signal,
} from '@angular/core';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DownloaderService } from './downloader.service';

@Component({
    selector: 'app-downloader',
    imports: [ButtonComponent, IconComponent],
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
}
