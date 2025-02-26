import { Component, input } from '@angular/core';
import { DownloadItem } from '../../downloader.types';
import { DatePipe, NgClass } from '@angular/common';

@Component({
    selector: 'app-download-item',
    imports: [DatePipe, NgClass],
    templateUrl: './download-item.component.html',
    styleUrl: './download-item.component.scss',
})
export class DownloadItemComponent {
    item = input.required<DownloadItem>();
}
