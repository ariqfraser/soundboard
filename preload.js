const { contextBridge, ipcRenderer } = require("electron");

const ipcListener = (channel, callback) => {
    return ipcRenderer.on(channel, (_, data) => callback(data));
};

contextBridge.exposeInMainWorld("electronAPI", {
    readDir: (path) => ipcRenderer.invoke("read-directory", path),
    close: () => ipcRenderer.invoke("close"),
    heartbeat: () => true,
    downloadVideo: (id) => ipcRenderer.invoke("download-video", id),
    downloadPlaylist: (id) => ipcRenderer.invoke("download-playlist", id),
    /**
     * listeners
     */
    onDownloadStarted: (callback) => ipcListener("download-started", callback),
    onDownloadProgress: (callback) => ipcListener("download-progress", callback),
    onDownloadCompleted: (callback) => ipcListener("download-completed", callback),
});
