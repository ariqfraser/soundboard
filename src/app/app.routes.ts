import { Routes } from '@angular/router';
import { AudioQueueComponent } from './features/audio-queue/audio-queue.component';
import { AudioMixerComponent } from './features/audio-mixer/audio-mixer.component';
import { DownloaderComponent } from './features/downloader/downloader.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'queue',
    },
    {
        path: 'queue',
        component: AudioQueueComponent,
    },
    {
        path: 'mixer',
        component: AudioMixerComponent,
    },
    {
        path: 'downloader',
        component: DownloaderComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
];
