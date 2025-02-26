import { Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { TestPageService } from './test-page.service';
import { NotificationStatus } from '../../services/notification/notification.types';

@Component({
    selector: 'app-test-page',
    imports: [IconComponent],
    templateUrl: './test-page.component.html',
    styleUrl: './test-page.component.scss',
})
export class TestPageComponent {
    private readonly testService = inject(TestPageService);

    showNotification(title: string, text: string, status: NotificationStatus) {
        this.testService.generateNotification(title, text, status);
    }
}
