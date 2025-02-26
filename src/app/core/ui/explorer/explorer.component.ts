import { Component, inject, input, OnInit } from '@angular/core';
import { ExplorerService } from './explorer.service';
import { ExplorerItemComponent } from './explorer-item/explorer-item.component';

@Component({
    selector: 'app-explorer',
    imports: [ExplorerItemComponent],
    templateUrl: './explorer.component.html',
    styleUrl: './explorer.component.scss',
})
export class ExplorerComponent implements OnInit {
    private readonly explorerService = inject(ExplorerService);

    path = input<string>('$APPDATA');

    directory = this.explorerService.directory;

    ngOnInit(): void {
        this.explorerService.read(this.path());
    }
}
