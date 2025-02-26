import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class ElectronApiService {
    get isElectron(): boolean {
        try {
            return window.electronAPI?.heartbeat();
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
