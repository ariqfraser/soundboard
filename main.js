const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const ROOT_DIR = path.join(process.env.APPDATA, ".soundfella");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1600,
        height: 900,
        frame: false,
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    // win.loadFile("./index.html");
    win.loadFile("./dist/standalone-v1/browser/index.html");
}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("read-directory", async (event, dirPath) => {
    // TODO: optimisation improvement. use a child process to index as the application runs. Log to a txt. Then read that pereodically.
    dirPath = dirPath === "$APPDATA" ? ROOT_DIR : path.join(ROOT_DIR, dirPath);
    try {
        const items = await fs.promises.readdir(dirPath, {
            withFileTypes: true,
        });

        const result = items
            .filter((item) => item.isDirectory() || /\.mp3$/.test(item.name))
            .map((item) => ({
                name: item.name,
                path: path.join(dirPath, item.name).replace(ROOT_DIR, ""),
                fullPath: path.join(dirPath, item.name),
                isDir: item.isDirectory(),
            }));

        return { success: true, data: result };
    } catch (e) {
        return {
            success: false,
            error: {
                message: e.message,
                code: e.code,
            },
        };
    }
});

ipcMain.handle("close", () => {
    app.quit();
});

const activeDownloads = new Map();

ipcMain.handle("download-video", async (event, videoID) => {
    try {
        if (!videoID.trim()) {
            return {
                success: false,
                error: {
                    message: "No videoID",
                    code: 400,
                },
            };
        }

        const downloadDir = path.join(ROOT_DIR, "downloads");
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        const args = [
            // "./yt-dlp.exe",
            "--no-keep-fragments",
            "--no-write-thumbnail",
            "-x",
            "--audio-format",
            "mp3",
            "--audio-quality",
            "0",
            "--no-keep-video",
            "--no-continue",
            "-P",
            downloadDir,
            "-o",
            "%(title)s [%(id)s]",
            `https://www.youtube.com/watch?v=${videoID}`,
        ];
        console.log(args.join(" "));

        const YT_DLP_PATH = path.join(ROOT_DIR, "yt-dlp.exe");
        const downloadProcess = spawn(YT_DLP_PATH, args);

        const startTime = Date.now();
        const downloadID = `${videoID}_${startTime}`;
        activeDownloads.set(downloadID, {
            process: downloadProcess,
            videoID,
            downloadDir,
            status: "downloading",
            progress: 0,
            startTime,
            output: [],
        });
        win.webContents.send("download-started", {
            downloadID,
            videoID,
            startTime,
            progress: 0,
            status: "downloading",
        });

        downloadProcess.stdout.on("data", (data) => {
            const output = data.toString();

            activeDownloads.get(downloadID).output.push(output);
            // console.log(activeDownloads.get(downloadID));

            const progressMatch = output.match(/([0-9.]+)%/);

            if (progressMatch) {
                const progress = parseFloat(progressMatch[1]);
                activeDownloads.get(downloadID).progress = progress;

                win.webContents.send("download-progress", {
                    downloadID,
                    progress,
                    status: "downloading",
                });
            }
        });

        return new Promise((res, rej) => {
            downloadProcess.on("close", (code) => {
                console.log("child process exited with code", code);

                const downloadData = activeDownloads.get(downloadID);

                if (code === 0) {
                    // OK
                    win.webContents.send("download-completed", {
                        downloadID,
                        videoID,
                        status: "completed",
                        duration: Date.now() - downloadData.startTime,
                        startTime: downloadData.startTime,
                        output: downloadData.output,
                    });

                    res({ success: true, data: { downloadID, status: "completed" } });
                } else {
                    // FAILED
                    downloadData.status = "failed";

                    const err = downloadData.output
                        .filter((line) => line.startsWith("ERROR"))
                        .join("\n");

                    win.webContents.send("download-failed", {
                        downloadID,
                        videoID,
                        status: "failed",
                        error: err || `Process exited with code ${code}`,
                    });

                    res({
                        success: false,
                        error: {
                            message: err || `Process exited with code ${code}`,
                            code,
                        },
                    });
                }

                setTimeout(() => activeDownloads.delete(downloadID), 30 * 60 * 1000);
            });
        });
    } catch (e) {
        return {
            success: false,
            error: {
                message: e.message,
                code: e.code,
            },
        };
    }
});
