import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-notification',
    imports: [],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    animations: [
        trigger('slideInOut', [
            state(
                'void',
                style({
                    transform: 'translateX(100%)',
                    opacity: 0,
                }),
            ),
            state(
                '*',
                style({
                    transform: 'translateX(0)',
                    opacity: 1,
                }),
            ),
            transition('void => *', animate('200ms ease-out')),
            transition('* => void', animate('200ms ease-in')),
        ]),
    ],
})
export class NotificationComponent {
    title: string = '';
    text?: string;
    actionText?: string;

    @Output() dismiss = new EventEmitter<void>();

    animationState: 'in' | 'void' = 'in';

    onDismiss(): void {
        this.startDismissAnimation();
    }

    onAction(): void {
        this.startDismissAnimation();
    }

    startDismissAnimation(): void {
        this.animationState = 'void';
    }

    onAnimationDone(event: any): void {
        if (event.toState === 'void') {
            this.dismiss.emit();
        }
    }
}
