import { inject, Injectable, signal } from '@angular/core';
import { Directory, ExplorerItem } from './explorer.types';
import { MockData } from './explorer.mock';
import { ElectronApiService } from '../../../services/electron-api/electron-api.service';

@Injectable({
    providedIn: 'root',
})
export class ExplorerService {
    private readonly electron = inject(ElectronApiService);
    directory = signal<Directory>([]);

    async read(path: string) {
        if (!this.electron.isElectron) {
            console.log('isElectron:', this.electron.isElectron);
            this.directory.set(MockData);
            return;
        }
        try {
            const res = await window.electronAPI.readDir(path);

            if (!res.success) {
                throw { message: res.error?.message, code: res.error?.code };
            }

            console.log(res.data);

            const processedDir: Directory = res.data!.map((item) => ({
                ...item,
                children: item.isDir ? [] : undefined,
                isOpen: false,
            }));

            processedDir.sort((a, b) => {
                if (a.isDir && !b.isDir) return -1;
                if (!a.isDir && b.isDir) return 1;
                return 0;
            });

            this.update(path, processedDir);
        } catch (error: any) {
            console.error('API Error: Failed runing readDir \n' + error.message);
        }
    }

    private update(path: string, data: Directory) {
        if (this.directory().length === 0) {
            this.directory.set(data);
            return;
        }

        const workingDir = structuredClone(this.directory());

        const targetFolder = this.searchForFolder(path, workingDir);
        targetFolder.children = data;

        // TODO: change later. as toggling open calls the read operation every time
        targetFolder.isOpen = !targetFolder.isOpen;

        this.directory.set(workingDir);
        console.log(this.directory());
    }

    private searchForFolder(path: string, workingDir: Directory): ExplorerItem {
        const pathSegments = path.split('\\');
        pathSegments.splice(0, 1);
        console.log(pathSegments);

        const maxDepth = pathSegments.length - 1;
        let currentDepth = 0;

        const search = (dir: Directory) => {
            const targetI = dir.findIndex((item) => item.name === pathSegments[currentDepth]);
            const target = dir[targetI];

            if (currentDepth === maxDepth) {
                return target;
            }

            currentDepth++;
            return search(target.children!);
        };

        return search(workingDir);
    }
}
