import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { NotificationComponent } from '../../shared/ui/notification/notification.component';

interface NotificationData {
    title: string;
    text: string;
    actionText?: string;
    life?: number;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly notifications: Map<OverlayRef, NotificationData> = new Map();
    private readonly spacing = 16; // spacing between notifications

    constructor(private overlay: Overlay) {}

    add(title: string, text: string, actionText?: string, life = 2000) {
        const positionStrategy = this.overlay
            .position()
            .global()
            .bottom(`${this.getOffsetY()}px`)
            .right(this.spacing + 'px');

        const overlayConfig: OverlayConfig = {
            positionStrategy,
            hasBackdrop: false,
        };
        const overlayRef = this.overlay.create(overlayConfig);

        // Store the notification data with its overlay reference
        const data: NotificationData = { title, text, actionText, life };
        this.notifications.set(overlayRef, data);

        // Create a portal and attach it to the overlay
        const componentPortal = new ComponentPortal(NotificationComponent);
        const componentRef = overlayRef.attach(componentPortal);
        const instance = componentRef.instance;
        instance.title = title;
        instance.text = text;
        instance.actionText = actionText;

        // auto-dissmiss then wait for animation finish b4 dismiss
        if (life > 0) {
            setTimeout(() => {
                instance.startDismissAnimation();
            }, life);
        }

        instance.dismiss.subscribe(() => {
            this.dismiss(overlayRef);
        });
    }

    dismiss(overlayRef: OverlayRef): void {
        if (this.notifications.has(overlayRef)) {
            this.notifications.delete(overlayRef);
            overlayRef.dispose();
            // Adjust positions of remaining notifications
            this.updatePositions();
        }
    }

    private getOffsetY(): number {
        let offset = this.spacing;

        this.notifications.forEach((_, ref) => {
            const element = ref.overlayElement;
            if (element) {
                offset += element.clientHeight + this.spacing;
            }
        });

        return offset;
    }

    private updatePositions(): void {
        let offset = 16;

        const entries = Array.from(this.notifications.entries()).sort((a, b) => {
            const aY = a[0].overlayElement.getBoundingClientRect().y;
            const bY = b[0].overlayElement.getBoundingClientRect().y;
            return bY - aY; // Sort from bottom to top
        });

        // Update positions of all notifications
        entries.forEach(([overlayRef, _]) => {
            const positionStrategy = this.overlay
                .position()
                .global()
                .bottom(`${offset}px`)
                .right('16px');

            overlayRef.updatePositionStrategy(positionStrategy);

            if (overlayRef.overlayElement) {
                offset += overlayRef.overlayElement.clientHeight + this.spacing;
            }
        });
    }
}
