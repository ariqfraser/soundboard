import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { TooltipComponent } from '../ui/tooltip/tooltip.component';

@Directive({
    selector: '[appTooltip]',
})
export class TooltipDirective {
    appTooltip = input.required<string | string[]>();

    private overlayRef?: OverlayRef;

    constructor(
        private elemRef: ElementRef,
        private overlay: Overlay,
    ) {}

    @HostListener('mouseenter')
    onEnter() {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elemRef.nativeElement)
            .withPositions([
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                    offsetY: 5,
                },
                {
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                    offsetY: -5,
                },
            ]);

        const overlayConfig: OverlayConfig = {
            positionStrategy,
            hasBackdrop: false,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
        };
        const overlayRef = this.overlay.create(overlayConfig);
        this.overlayRef = overlayRef;

        const portal = new ComponentPortal(TooltipComponent);
        const componentRef = overlayRef.attach(portal);
        const instance = componentRef.instance;
        instance.text = this.appTooltip();
    }

    @HostListener('mouseleave')
    onLeave() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = undefined;
        }
    }
}
