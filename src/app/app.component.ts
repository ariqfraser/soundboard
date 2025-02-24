import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from './shared/ui/button/button.component';
import { AudioPlayerService } from './services/audio-player/audio-player.service';
import { DirectoryComponent } from './shared/ui/directory/directory.component';

@Component({
    selector: 'app-root',
    imports: [ButtonComponent, DirectoryComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private readonly ap = inject(AudioPlayerService);

    test = signal(window.localStorage.getItem('test') ?? 'NONE SET');
    ngOnInit(): void {
        this.ap.play();
    }
    open() {}

    testSet(x: string) {
        window.localStorage.setItem('test', x);
    }
}
