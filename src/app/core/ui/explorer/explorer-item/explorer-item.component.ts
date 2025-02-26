import { Component, inject, input } from '@angular/core';
import { ExplorerItem } from '../explorer.types';
import { ExplorerService } from '../explorer.service';
import { AudioPlayerService } from '../../../../services/audio-player/audio-player.service';

@Component({
    selector: 'app-explorer-item',
    imports: [ExplorerItemComponent],
    templateUrl: './explorer-item.component.html',
    styleUrl: './explorer-item.component.scss',
})
export class ExplorerItemComponent {
    private readonly service = inject(ExplorerService);
    private readonly ap = inject(AudioPlayerService);
    item = input.required<ExplorerItem>();

    itemClick() {
        if (!this.item().isDir) {
            this.ap.directPlay(this.item());
            return;
        }
        this.service.read(this.item().path);
    }
}
