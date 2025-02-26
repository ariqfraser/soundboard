import { Injectable } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationStatus } from '../../services/notification/notification.types';

@Injectable({
    providedIn: 'root',
})
export class TestPageService {
    constructor(private notification: NotificationService) {}

    generateNotification(title: string, text: string, status: NotificationStatus, life = 4000) {
        this.notification.show(title, text, status, life);
    }
}
