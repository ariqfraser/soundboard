export interface DownloadItem {
    videoID: string;
    status: 'downloading' | 'completed' | 'failed';
    fileName: string;
    output: string[];
    startTime: number;
    progress: number;
    duration: number;
    downloadID: DownloadID;
}

export type DownloadID = string;
