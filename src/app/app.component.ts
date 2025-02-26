import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExplorerComponent } from './core/ui/explorer/explorer.component';
import { MatIcon } from '@angular/material/icon';
import { NavComponent } from './core/ui/nav/nav.component';
import { IconComponent } from './shared/ui/icon/icon.component';

@Component({
    selector: 'app-root',
    imports: [ExplorerComponent, RouterOutlet, NavComponent, IconComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    closeApp() {
        console.log('closing');
        window.electronAPI.close();
    }
}
