export type Directory = ExplorerItem[];

export interface ExplorerItem {
    name: string;
    path: string;
    fullPath: string;
    isDir: boolean;
    isOpen: boolean;
    children?: Directory;
}
