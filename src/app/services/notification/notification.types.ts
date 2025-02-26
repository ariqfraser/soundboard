export interface NotificationData {
    title: string;
    text: string;
    life?: number;
}

export type NotificationStatus = 'success' | 'warning' | 'error' | 'info';
