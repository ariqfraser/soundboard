declare global {
    interface Window {
        electronAPI: {
            readDir: (path: string) => Promise<IPCResponse<ReadDirRes>>;
            close: () => void;
            heartbeat: () => boolean;
            downloadVideo: (videoID: string) => Promise<IPCResponse<void>>;
            onDownloadStarted: (callback: (res: DownloadStartedAPIRes) => void) => void;
            onDownloadProgress: (callback: (res: DownloadProgressAPIRes) => void) => void;
            onDownloadCompleted: (callback: (res: DownloadCompletedAPIRes) => void) => void;
        };
    }
}

interface IPCResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: number;
    };
}

type ReadDirRes = { name: string; path: string; isDir: boolean; fullPath: string }[];

interface DownloadAPIRes {
    downloadID: string;
    status: 'downloading' | 'failed' | 'completed';
}

export interface DownloadStartedAPIRes extends DownloadAPIRes {
    videoID: string;
    progress: number;
    startTime: number;
}

export interface DownloadProgressAPIRes extends DownloadAPIRes {
    progress: number;
}

export interface DownloadCompletedAPIRes extends DownloadStartedAPIRes {
    duration: number;
    output: string[];
}
