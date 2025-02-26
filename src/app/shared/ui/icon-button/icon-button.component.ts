import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-icon-button',
    imports: [IconComponent],
    templateUrl: './icon-button.component.html',
    styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
    bgColor = input<'primary'>('primary');
}
