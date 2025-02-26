import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    imports: [],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
    text: string | string[] = '';
}
